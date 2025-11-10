/**
 * 統一 API 回應格式
 *
 * 所有 API 端點必須使用此模組回傳標準化的 JSON 回應
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    retryAfter?: number;
  };
}

/**
 * 建立成功回應
 */
export function success<T>(data?: T, message?: string): Response {
  const response: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data && { data }),
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 建立錯誤回應
 */
export function error(
  statusCode: number,
  code: string,
  message: string,
  details?: any,
  retryAfter?: number,
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      ...(retryAfter && { retryAfter }),
    },
  };

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 常見錯誤回應快捷方式
 */
export const badRequest = (code: string, message: string, details?: any) =>
  error(400, code, message, details);

export const unauthorized = (message = '未授權的請求') =>
  error(401, 'UNAUTHORIZED', message);

export const forbidden = (message = '無權限執行此操作') =>
  error(403, 'FORBIDDEN', message);

export const notFound = (message = '找不到指定的資源') =>
  error(404, 'NOT_FOUND', message);

export const conflict = (code: string, message: string) =>
  error(409, code, message);

export const rateLimitExceeded = (retryAfter = 60) =>
  error(
    429,
    'RATE_LIMIT_EXCEEDED',
    `請求過於頻繁,請等待 ${retryAfter} 秒後再試`,
    undefined,
    retryAfter,
  );

export const internalError = (message = '伺服器內部錯誤') =>
  error(500, 'INTERNAL_ERROR', message);
