/**
 * JWT 認證中介層
 * 
 * 驗證請求中的 JWT Token 並取得使用者資訊
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as response from './response.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

export interface AuthUser {
  userId: string;
  email: string;
}

/**
 * 從請求標頭中驗證 JWT Token
 * 
 * @param req - 請求物件
 * @returns 使用者資訊或錯誤回應
 */
export async function verifyAuth(req: Request): Promise<AuthUser | Response> {
  try {
    // 取得 Authorization 標頭
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.unauthorized('缺少認證 Token');
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前綴

    // 使用 Supabase client 驗證 Token
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return response.unauthorized('無效或已過期的 Token');
    }

    // 返回使用者資訊
    return {
      userId: user.id,
      email: user.email || '',
    };
  } catch (error) {
    console.error('[Auth] Token 驗證錯誤:', error);
    return response.unauthorized('Token 驗證失敗');
  }
}

/**
 * 包裝需要認證的處理函式
 * 
 * @param handler - 處理函式,接收 Request 和 AuthUser
 * @returns 包裝後的處理函式
 */
export function requireAuth(
  handler: (req: Request, user: AuthUser) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const authResult = await verifyAuth(req);
    
    // 如果驗證失敗,返回錯誤回應
    if (authResult instanceof Response) {
      return authResult;
    }

    // 驗證成功,呼叫處理函式
    return await handler(req, authResult);
  };
}
