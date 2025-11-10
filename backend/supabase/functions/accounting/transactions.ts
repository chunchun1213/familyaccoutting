/**
 * 交易記錄管理 API
 * 
 * GET /api/transactions - 查詢交易記錄列表
 * POST /api/transactions - 新增交易記錄
 */

import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { withMiddleware } from '../_shared/error-handler.ts';
import * as response from '../_shared/response.ts';
import * as validation from '../_shared/validation.ts';
import { requireAuth } from '../_shared/auth-middleware.ts';
import { getAdminClient } from '../_shared/database.ts';

const app = new Hono();

interface CreateTransactionRequest {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note?: string;
}

/**
 * 查詢交易記錄列表
 */
async function handleGetTransactions(req: Request): Promise<Response> {
  return await requireAuth(async (req, user) => {
    try {
      const url = new URL(req.url);
      const limit = Math.min(
        parseInt(url.searchParams.get('limit') || '20'),
        100
      );
      const cursor = url.searchParams.get('cursor');
      const type = url.searchParams.get('type');
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');

      const supabase = getAdminClient();

      // 建立查詢
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.userId)
        .order('created_at', { ascending: false })
        .limit(limit + 1); // 多查一筆來判斷是否有下一頁

      // 套用篩選條件
      if (type && (type === 'income' || type === 'expense')) {
        query = query.eq('type', type);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      // 游標分頁
      if (cursor) {
        const [cursorTime, cursorId] = cursor.split('_');
        query = query.or(
          `created_at.lt.${cursorTime},and(created_at.eq.${cursorTime},id.lt.${cursorId})`
        );
      }

      const { data: transactions, error: fetchError, count } = await query;

      if (fetchError) {
        console.error('[Transactions] 查詢錯誤:', fetchError);
        return response.internalError('查詢失敗,請稍後再試');
      }

      // 判斷是否有下一頁
      const hasMore = transactions.length > limit;
      const items = hasMore ? transactions.slice(0, limit) : transactions;

      // 產生下一頁游標
      let nextCursor = null;
      if (hasMore && items.length > 0) {
        const lastItem = items[items.length - 1];
        nextCursor = `${lastItem.created_at}_${lastItem.id}`;
      }

      return response.success({
        transactions: items.map((t) => ({
          id: t.id,
          type: t.type,
          category: t.category,
          amount: parseFloat(t.amount),
          note: t.note,
          createdAt: t.created_at,
        })),
        pagination: {
          hasMore,
          nextCursor,
          total: count || 0,
        },
      });
    } catch (error) {
      console.error('[Transactions] 處理錯誤:', error);
      return response.internalError('查詢失敗,請稍後再試');
    }
  })(req);
}

/**
 * 新增交易記錄
 */
async function handleCreateTransaction(req: Request): Promise<Response> {
  return await requireAuth(async (req, user) => {
    try {
      const body = await req.json() as CreateTransactionRequest;
      const { type, category, amount, note } = body;

      // 1. 驗證必要欄位
      const missingFields = validation.validateRequiredFields(body, [
        'type',
        'category',
        'amount',
      ]);

      if (missingFields.length > 0) {
        return response.badRequest(
          'MISSING_FIELDS',
          `缺少必要欄位: ${missingFields.join(', ')}`
        );
      }

      // 2. 驗證類型
      if (type !== 'income' && type !== 'expense') {
        return response.badRequest(
          'INVALID_TYPE',
          '類型必須為 income 或 expense'
        );
      }

      // 3. 驗證金額
      if (!validation.isValidAmount(amount)) {
        return response.badRequest(
          'INVALID_AMOUNT',
          '金額必須大於 0 且小於等於 1,000,000'
        );
      }

      // 4. 驗證類別
      if (!category || category.trim().length === 0) {
        return response.badRequest('INVALID_CATEGORY', '類別不可為空');
      }

      const supabase = getAdminClient();

      // 5. 建立交易記錄
      const { data: transaction, error: createError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.userId,
          type,
          category: category.trim(),
          amount: amount.toFixed(2),
          note: note?.trim() || null,
        })
        .select()
        .single();

      if (createError) {
        console.error('[Transactions] 建立錯誤:', createError);
        return response.internalError('建立失敗,請稍後再試');
      }

      // 6. 返回成功回應
      return response.success(
        {
          id: transaction.id,
          type: transaction.type,
          category: transaction.category,
          amount: parseFloat(transaction.amount),
          note: transaction.note,
          createdAt: transaction.created_at,
        },
        '記錄新增成功'
      );
    } catch (error) {
      console.error('[Transactions] 處理錯誤:', error);
      return response.internalError('建立失敗,請稍後再試');
    }
  })(req);
}

// 路由
app.get('/api/transactions', async (c) => {
  return await handleGetTransactions(c.req.raw);
});

app.post('/api/transactions', async (c) => {
  return await handleCreateTransaction(c.req.raw);
});

// 匯出主處理函式
export default async function handler(req: Request): Promise<Response> {
  return await withMiddleware((req: Request) => app.fetch(req))(req);
}

// Deno.serve 處理函式
Deno.serve(handler);
