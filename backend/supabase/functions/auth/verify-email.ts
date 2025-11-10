/**
 * Email 驗證 API
 * 
 * POST /api/verify-email
 * 
 * 驗證使用者輸入的驗證碼並建立帳號
 */

import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { withMiddleware } from '../_shared/error-handler.ts';
import * as response from '../_shared/response.ts';
import * as validation from '../_shared/validation.ts';
import { getAdminClient } from '../_shared/database.ts';
import { hash } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const app = new Hono();

interface VerifyEmailRequest {
  email: string;
  code: string;
  name: string;
  password: string;
}

/**
 * Email 驗證處理函式
 */
async function handleVerifyEmail(req: Request): Promise<Response> {
  try {
    // 解析請求 body
    const body = await req.json() as VerifyEmailRequest;
    const { email, code, name, password } = body;

    // 1. 驗證必要欄位
    const missingFields = validation.validateRequiredFields(body, [
      'email',
      'code',
      'name',
      'password',
    ]);

    if (missingFields.length > 0) {
      return response.badRequest(
        'MISSING_FIELDS',
        `缺少必要欄位: ${missingFields.join(', ')}`
      );
    }

    // 2. 驗證 Email 格式
    if (!validation.isValidEmail(email)) {
      return response.badRequest('INVALID_EMAIL', 'Email 格式錯誤');
    }

    // 3. 驗證驗證碼格式
    if (!validation.isValidVerificationCode(code)) {
      return response.badRequest('INVALID_CODE', '驗證碼格式錯誤');
    }

    const supabase = getAdminClient();

    // 4. 查詢驗證碼記錄
    const { data: verificationRecord, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verificationRecord) {
      return response.badRequest('CODE_NOT_FOUND', '找不到驗證碼記錄');
    }

    // 5. 檢查是否已鎖定
    if (verificationRecord.is_locked) {
      return response.badRequest(
        'CODE_LOCKED',
        '驗證碼已被鎖定,請重新註冊'
      );
    }

    // 6. 檢查驗證碼是否過期
    const expiresAt = new Date(verificationRecord.expires_at);
    if (Date.now() > expiresAt.getTime()) {
      return response.badRequest('CODE_EXPIRED', '驗證碼已過期,請重新註冊');
    }

    // 7. 驗證驗證碼
    if (verificationRecord.code !== code) {
      // 增加失敗次數
      const newFailedAttempts = verificationRecord.failed_attempts + 1;
      const isLocked = newFailedAttempts >= 5;

      await supabase
        .from('verification_codes')
        .update({
          failed_attempts: newFailedAttempts,
          is_locked: isLocked,
        })
        .eq('id', verificationRecord.id);

      if (isLocked) {
        return response.badRequest(
          'CODE_LOCKED',
          '驗證碼錯誤次數過多,已鎖定。請重新註冊'
        );
      }

      return response.badRequest(
        'INVALID_CODE',
        `驗證碼錯誤,剩餘 ${5 - newFailedAttempts} 次機會`
      );
    }

    // 8. 驗證成功,建立使用者帳號
    const passwordHash = await hash(password);

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        email_verified: true,
      })
      .select()
      .single();

    if (createError) {
      console.error('[VerifyEmail] 建立使用者失敗:', createError);
      return response.internalError('建立帳號失敗,請稍後再試');
    }

    // 9. 刪除已使用的驗證碼
    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', verificationRecord.id);

    // 10. 使用 Supabase Auth 建立 session
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (authError) {
      console.error('[VerifyEmail] 建立 session 失敗:', authError);
      // 使用者已建立,但 session 建立失敗,引導使用者登入
      return response.success(
        {
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        '帳號建立成功,請使用 Email 和密碼登入'
      );
    }

    // 11. 返回成功回應(含 Token)
    return response.success(
      {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: authData.session?.access_token,
        refreshToken: authData.session?.refresh_token,
        expiresAt: authData.session?.expires_at,
      },
      '帳號建立成功,已自動登入'
    );
  } catch (error) {
    console.error('[VerifyEmail] 處理錯誤:', error);
    return response.internalError('驗證失敗,請稍後再試');
  }
}

// 驗證路由
app.post('/api/verify-email', async (c) => {
  return await handleVerifyEmail(c.req.raw);
});

// 匯出主處理函式
export default async function handler(req: Request): Promise<Response> {
  return await withMiddleware((req: Request) => app.fetch(req))(req);
}

// Deno.serve 處理函式
Deno.serve(handler);
