/**
 * 財務概覽 API
 *
 * GET /api/summary - 取得財務統計摘要
 */

import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { withMiddleware } from '../_shared/error-handler.ts';
import * as response from '../_shared/response.ts';
import { requireAuth } from '../_shared/auth-middleware.ts';
import { getAdminClient } from '../_shared/database.ts';

const app = new Hono();

/**
 * 取得財務摘要
 */
async function handleGetSummary(req: Request): Promise<Response> {
  return await requireAuth(async (req, user) => {
    try {
      const url = new URL(req.url);
      const period = url.searchParams.get('period') || 'month'; // day, week, month, year

      const supabase = getAdminClient();

      // 計算時間範圍
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      // 查詢收入總額
      const { data: incomeData, error: incomeError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.userId)
        .eq('type', 'income')
        .gte('created_at', startDate.toISOString());

      if (incomeError) {
        console.error('[Summary] 查詢收入錯誤:', incomeError);
        return response.internalError('查詢失敗,請稍後再試');
      }

      // 查詢支出總額
      const { data: expenseData, error: expenseError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.userId)
        .eq('type', 'expense')
        .gte('created_at', startDate.toISOString());

      if (expenseError) {
        console.error('[Summary] 查詢支出錯誤:', expenseError);
        return response.internalError('查詢失敗,請稍後再試');
      }

      // 計算總額
      const totalIncome = incomeData.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0,
      );
      const totalExpense = expenseData.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0,
      );
      const balance = totalIncome - totalExpense;

      // 查詢類別統計(僅支出)
      const { data: categoryData, error: categoryError } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('user_id', user.userId)
        .eq('type', 'expense')
        .gte('created_at', startDate.toISOString());

      if (categoryError) {
        console.error('[Summary] 查詢類別錯誤:', categoryError);
        return response.internalError('查詢失敗,請稍後再試');
      }

      // 依類別分組統計
      const categoryMap = new Map<string, number>();
      categoryData.forEach((t) => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + parseFloat(t.amount));
      });

      const topCategories = Array.from(categoryMap.entries())
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5); // 取前 5 名

      return response.success({
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        summary: {
          totalIncome,
          totalExpense,
          balance,
        },
        topCategories,
      });
    } catch (error) {
      console.error('[Summary] 處理錯誤:', error);
      return response.internalError('查詢失敗,請稍後再試');
    }
  })(req);
}

// 路由
app.get('/api/summary', async (c) => {
  return await handleGetSummary(c.req.raw);
});

// 匯出主處理函式
export default async function handler(req: Request): Promise<Response> {
  return await withMiddleware((req: Request) => app.fetch(req))(req);
}

// Deno.serve 處理函式
Deno.serve(handler);
