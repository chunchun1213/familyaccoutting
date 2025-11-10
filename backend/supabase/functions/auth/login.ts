/**
 * 會員登入 API
 *
 * POST /api/login
 *
 * 驗證使用者 Email 和密碼並建立 session
 */

import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { withMiddleware } from '../_shared/error-handler.ts';
import * as response from '../_shared/response.ts';
import * as validation from '../_shared/validation.ts';
import { getAdminClient } from '../_shared/database.ts';
import { compare } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const app = new Hono();

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 登入處理函式
 */
async function handleLogin(req: Request): Promise<Response> {
  try {
    // 解析請求 body
    const body = await req.json() as LoginRequest;
    const { email, password } = body;

    // 1. 驗證必要欄位
    const missingFields = validation.validateRequiredFields(body, [
      'email',
      'password',
    ]);

    if (missingFields.length > 0) {
      return response.badRequest(
        'MISSING_FIELDS',
        `缺少必要欄位: ${missingFields.join(', ')}`,
      );
    }

    // 2. 驗證 Email 格式
    if (!validation.isValidEmail(email)) {
      return response.badRequest('INVALID_EMAIL', 'Email 格式錯誤');
    }

    const supabase = getAdminClient();

    // 3. 查詢使用者
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      return response.badRequest('INVALID_CREDENTIALS', 'Email 或密碼錯誤');
    }

    // 4. 驗證密碼
    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return response.badRequest('INVALID_CREDENTIALS', 'Email 或密碼錯誤');
    }

    // 5. 檢查 Email 是否已驗證
    if (!user.email_verified) {
      return response.badRequest(
        'EMAIL_NOT_VERIFIED',
        '請先完成 Email 驗證',
      );
    }

    // 6. 使用 Supabase Auth 建立 session
    const { data: authData, error: authError } = await supabase.auth
      .signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

    if (authError || !authData.session) {
      console.error('[Login] 建立 session 失敗:', authError);
      return response.internalError('登入失敗,請稍後再試');
    }

    // 7. 更新最後登入時間
    await supabase
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // 8. 返回成功回應(含 Token)
    return response.success(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        token: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at,
      },
      '登入成功',
    );
  } catch (error) {
    console.error('[Login] 處理錯誤:', error);
    return response.internalError('登入失敗,請稍後再試');
  }
}

// 登入路由
app.post('/api/login', async (c) => {
  return await handleLogin(c.req.raw);
});

// 匯出主處理函式
export default async function handler(req: Request): Promise<Response> {
  return await withMiddleware((req: Request) => app.fetch(req))(req);
}

// Deno.serve 處理函式
Deno.serve(handler);
