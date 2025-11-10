/**
 * 全域錯誤處理中介層
 *
 * 捕捉未處理的錯誤並返回標準化的錯誤回應
 */

import * as response from './response.ts';

/**
 * 錯誤處理包裝器
 *
 * @param handler - 處理函式
 * @returns 包裝後的處理函式
 */
export function withErrorHandler(
  handler: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('[Error] 未捕獲的錯誤:', error);

      // 記錄詳細的錯誤資訊
      if (error instanceof Error) {
        console.error('錯誤訊息:', error.message);
        console.error('錯誤堆疊:', error.stack);
      }

      // 返回通用錯誤回應
      return response.internalError('伺服器發生錯誤,請稍後再試');
    }
  };
}

/**
 * CORS 標頭處理
 *
 * @param handler - 處理函式
 * @returns 包裝後的處理函式
 */
export function withCors(
  handler: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    // 處理 OPTIONS 預檢請求
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 處理實際請求
    const response = await handler(req);

    // 添加 CORS 標頭
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

/**
 * 組合多個中介層
 *
 * @param handler - 處理函式
 * @returns 包裝後的處理函式
 */
export function withMiddleware(
  handler: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return withCors(withErrorHandler(handler));
}
