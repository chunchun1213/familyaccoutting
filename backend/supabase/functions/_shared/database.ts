/**
 * 資料庫輔助工具
 *
 * 提供資料庫連線和常用查詢功能
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
  '';

/**
 * 建立 Supabase 管理員客戶端
 *
 * 使用 service_role key,可繞過 RLS 限制
 */
export function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * 建立 Supabase 一般客戶端
 *
 * 使用 anon key,受 RLS 限制
 */
export function getClient() {
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * 執行原始 SQL 查詢
 *
 * @param query - SQL 查詢字串
 * @param params - 查詢參數
 * @returns 查詢結果
 */
export async function executeQuery<T = any>(
  query: string,
  params?: any[],
): Promise<T[]> {
  const client = getAdminClient();
  const { data, error } = await client.rpc('execute_sql', {
    query,
    params: params || [],
  });

  if (error) {
    console.error('[Database] 查詢錯誤:', error);
    throw error;
  }

  return data as T[];
}
