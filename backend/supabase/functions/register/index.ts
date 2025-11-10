/**
 * 會員註冊 API
 *
 * POST /api/register
 *
 * 建立新會員帳號並發送驗證碼到 Email
 */

import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { getAdminClient } from '../_shared/database.ts';
import {
  generateVerificationCode,
  sendVerificationCode,
} from '../_shared/email.ts';
import * as response from '../_shared/response.ts';
import * as validation from '../_shared/validation.ts';

const app = new Hono();

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 註冊處理函式
 */
async function handleRegister(req: Request): Promise<Response> {
  try {
    // 解析請求 body
    const body = await req.json() as RegisterRequest;
    const { name, email, password, confirmPassword } = body;

    // 1. 驗證必要欄位
    const missingFields = validation.validateRequiredFields(body, [
      'name',
      'email',
      'password',
      'confirmPassword',
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

    // 3. 驗證密碼規則
    if (!validation.isValidPassword(password)) {
      return response.badRequest(
        'WEAK_PASSWORD',
        '密碼必須為 8-20 碼,且包含大寫英文、小寫英文、數字',
      );
    }

    // 4. 驗證密碼一致性
    if (password !== confirmPassword) {
      return response.badRequest(
        'PASSWORD_MISMATCH',
        '密碼與確認密碼不一致',
      );
    }

    const supabase = getAdminClient();

    // 5. 檢查 Email 是否已被註冊
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return response.conflict('EMAIL_EXISTS', '此 Email 已被註冊');
    }

    // 6. 檢查驗證碼發送頻率限制(60 秒)
    const { data: recentCode } = await supabase
      .from('verification_codes')
      .select('created_at')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentCode) {
      const timeSinceLastCode = Date.now() -
        new Date(recentCode.created_at).getTime();
      const cooldownMs = 60 * 1000; // 60 秒

      if (timeSinceLastCode < cooldownMs) {
        const retryAfter = Math.ceil((cooldownMs - timeSinceLastCode) / 1000);
        return response.rateLimitExceeded(retryAfter);
      }
    }

    // 7. 產生驗證碼
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 分鐘後過期

    // 8. 儲存驗證碼到資料庫
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email: body.email.toLowerCase(),
        code,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        is_locked: false,
      });

    if (insertError) {
      console.error('[Register] 儲存驗證碼失敗:', insertError);
      return response.internalError('註冊失敗,請稍後再試');
    }

    // 9. 發送驗證碼 Email
    const emailSent = await sendVerificationCode(body.email, code, name);

    if (!emailSent) {
      console.error('[Register] Email 發送失敗');
      // 不返回錯誤,因為驗證碼已儲存,使用者可重新發送
    }

    // 10. 返回成功回應
    return response.success(
      {
        email: email.toLowerCase(),
        expiresAt: expiresAt.toISOString(),
      },
      '驗證碼已發送到您的 Email,請在 5 分鐘內完成驗證',
    );
  } catch (error) {
    console.error('[Register] 處理錯誤:', error);
    return response.internalError('註冊失敗,請稍後再試');
  }
}

// 主處理函式 - 直接處理所有 POST 請求
Deno.serve(async (req: Request): Promise<Response> => {
  // CORS 處理
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'METHOD_NOT_ALLOWED', message: '僅支援 POST 請求' },
      }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // 處理註冊請求
  try {
    return await handleRegister(req);
  } catch (error) {
    console.error('[Register] 未處理的錯誤:', error);
    return response.internalError('系統錯誤,請稍後再試');
  }
});
