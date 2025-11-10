/**
 * 會員登出 API
 *
 * POST /api/logout
 *
 * 登出使用者並撤銷 session
 */

import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { withMiddleware } from '../_shared/error-handler.ts';
import * as response from '../_shared/response.ts';
import { requireAuth } from '../_shared/auth-middleware.ts';

const app = new Hono();

/**
 * 登出處理函式
 */
async function handleLogout(req: Request): Promise<Response> {
  return await requireAuth(async (req, user) => {
    try {
      // Supabase Auth 會自動處理 token 撤銷
      // 這裡只需返回成功回應

      return response.success(null, '登出成功');
    } catch (error) {
      console.error('[Logout] 處理錯誤:', error);
      return response.internalError('登出失敗,請稍後再試');
    }
  })(req);
}

// 登出路由
app.post('/api/logout', async (c) => {
  return await handleLogout(c.req.raw);
});

// 匯出主處理函式
export default async function handler(req: Request): Promise<Response> {
  return await withMiddleware((req: Request) => app.fetch(req))(req);
}

// Deno.serve 處理函式
Deno.serve(handler);
