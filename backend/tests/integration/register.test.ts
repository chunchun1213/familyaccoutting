/**
 * 註冊 API 整合測試
 * 
 * 測試目標: POST /api/register
 * 
 * 測試場景:
 * 1. 成功註冊並發送驗證碼
 * 2. Email 格式錯誤
 * 3. 密碼不符合規則
 * 4. 密碼不一致
 * 5. Email 已被註冊
 * 6. 請求頻率限制
 * 7. 缺少必要欄位
 */

import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// 載入環境變數
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

// 建立 Supabase 管理員客戶端(用於測試前後清理資料)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * 清理測試資料
 */
async function cleanupTestData(email: string) {
  // 刪除驗證碼記錄
  await supabase
    .from('verification_codes')
    .delete()
    .eq('email', email.toLowerCase());

  // 刪除使用者記錄
  await supabase
    .from('users')
    .delete()
    .eq('email', email.toLowerCase());
}

/**
 * 呼叫註冊 API
 */
async function callRegisterAPI(body: any) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    data: await response.json(),
  };
}

// ========== 測試案例 ==========

Deno.test({
  name: "註冊 API - 成功註冊並發送驗證碼",
  async fn() {
    const testEmail = 'test-register-success@example.com';
    
    // 清理測試資料
    await cleanupTestData(testEmail);

    try {
      // 發送註冊請求
      const result = await callRegisterAPI({
        name: '測試使用者',
        email: testEmail,
        password: 'TestPass123',
        confirmPassword: 'TestPass123',
      });

      // 驗證回應狀態
      assertEquals(result.status, 200, '應該返回 200 狀態碼');
      assertEquals(result.data.success, true, '應該返回 success: true');
      assertEquals(
        result.data.message,
        '驗證碼已發送到您的 Email,請在 5 分鐘內完成驗證',
        '應該返回正確的成功訊息'
      );

      // 驗證回應資料
      assertExists(result.data.data, '應該包含 data 物件');
      assertEquals(result.data.data.email, testEmail, '應該返回正確的 email');
      assertExists(result.data.data.expiresAt, '應該包含 expiresAt');

      // 驗證驗證碼已存入資料庫
      const { data: verificationCode, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('email', testEmail)
        .single();

      assertEquals(error, null, '應該能查詢到驗證碼記錄');
      assertExists(verificationCode, '應該存在驗證碼記錄');
      assertEquals(verificationCode.email, testEmail, '驗證碼記錄的 email 應該正確');
      assertEquals(verificationCode.code.length, 6, '驗證碼應該是 6 位數');
      assertEquals(verificationCode.attempts, 0, '失敗嘗試次數應該為 0');
      assertEquals(verificationCode.is_locked, false, '驗證碼不應該被鎖定');

      console.log('✅ 成功註冊測試通過');
      console.log('   生成的驗證碼:', verificationCode.code);
    } finally {
      // 清理測試資料
      await cleanupTestData(testEmail);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - Email 格式錯誤",
  async fn() {
    const result = await callRegisterAPI({
      name: '測試使用者',
      email: 'invalid-email-format',
      password: 'TestPass123',
      confirmPassword: 'TestPass123',
    });

    assertEquals(result.status, 400, '應該返回 400 狀態碼');
    assertEquals(result.data.success, false, '應該返回 success: false');
    assertEquals(result.data.error.code, 'INVALID_EMAIL', '錯誤代碼應該是 INVALID_EMAIL');
    assertEquals(result.data.error.message, 'Email 格式錯誤', '錯誤訊息應該正確');

    console.log('✅ Email 格式錯誤測試通過');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - 密碼不符合規則 (缺少大寫字母)",
  async fn() {
    const result = await callRegisterAPI({
      name: '測試使用者',
      email: 'test@example.com',
      password: 'testpass123',  // 缺少大寫字母
      confirmPassword: 'testpass123',
    });

    assertEquals(result.status, 400, '應該返回 400 狀態碼');
    assertEquals(result.data.success, false, '應該返回 success: false');
    assertEquals(result.data.error.code, 'WEAK_PASSWORD', '錯誤代碼應該是 WEAK_PASSWORD');
    assertEquals(
      result.data.error.message,
      '密碼必須為 8-20 碼,且包含大寫英文、小寫英文、數字',
      '錯誤訊息應該正確'
    );

    console.log('✅ 密碼格式錯誤測試通過');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - 密碼不符合規則 (長度不足)",
  async fn() {
    const result = await callRegisterAPI({
      name: '測試使用者',
      email: 'test@example.com',
      password: 'Test123',  // 只有 7 個字元
      confirmPassword: 'Test123',
    });

    assertEquals(result.status, 400, '應該返回 400 狀態碼');
    assertEquals(result.data.error.code, 'WEAK_PASSWORD', '錯誤代碼應該是 WEAK_PASSWORD');

    console.log('✅ 密碼長度不足測試通過');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - 密碼與確認密碼不一致",
  async fn() {
    const result = await callRegisterAPI({
      name: '測試使用者',
      email: 'test@example.com',
      password: 'TestPass123',
      confirmPassword: 'TestPass456',  // 不一致
    });

    assertEquals(result.status, 400, '應該返回 400 狀態碼');
    assertEquals(result.data.success, false, '應該返回 success: false');
    assertEquals(result.data.error.code, 'PASSWORD_MISMATCH', '錯誤代碼應該是 PASSWORD_MISMATCH');
    assertEquals(result.data.error.message, '密碼與確認密碼不一致', '錯誤訊息應該正確');

    console.log('✅ 密碼不一致測試通過');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - Email 已被註冊",
  async fn() {
    const testEmail = 'test-duplicate@example.com';
    
    // 清理測試資料
    await cleanupTestData(testEmail);

    try {
      // 先建立一個使用者
      await supabase.from('users').insert({
        name: '已存在的使用者',
        email: testEmail,
        hashed_password: 'dummy_hash',
        is_verified: false,
      });

      // 嘗試用相同 email 註冊
      const result = await callRegisterAPI({
        name: '新使用者',
        email: testEmail,
        password: 'TestPass123',
        confirmPassword: 'TestPass123',
      });

      assertEquals(result.status, 409, '應該返回 409 狀態碼');
      assertEquals(result.data.success, false, '應該返回 success: false');
      assertEquals(result.data.error.code, 'EMAIL_EXISTS', '錯誤代碼應該是 EMAIL_EXISTS');
      assertEquals(result.data.error.message, '此 Email 已被註冊', '錯誤訊息應該正確');

      console.log('✅ Email 重複註冊測試通過');
    } finally {
      // 清理測試資料
      await cleanupTestData(testEmail);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - 請求頻率限制 (60 秒冷卻時間)",
  async fn() {
    const testEmail = 'test-rate-limit@example.com';
    
    // 清理測試資料
    await cleanupTestData(testEmail);

    try {
      // 第一次註冊請求
      const firstResult = await callRegisterAPI({
        name: '測試使用者',
        email: testEmail,
        password: 'TestPass123',
        confirmPassword: 'TestPass123',
      });

      assertEquals(firstResult.status, 200, '第一次請求應該成功');

      // 立即發送第二次請求
      const secondResult = await callRegisterAPI({
        name: '測試使用者',
        email: testEmail,
        password: 'TestPass123',
        confirmPassword: 'TestPass123',
      });

      assertEquals(secondResult.status, 429, '第二次請求應該被限流,返回 429 狀態碼');
      assertEquals(secondResult.data.success, false, '應該返回 success: false');
      assertEquals(
        secondResult.data.error.code,
        'RATE_LIMIT_EXCEEDED',
        '錯誤代碼應該是 RATE_LIMIT_EXCEEDED'
      );
      assertExists(secondResult.data.error.retryAfter, '應該包含 retryAfter');
      
      console.log('✅ 請求頻率限制測試通過');
      console.log('   重試等待時間:', secondResult.data.error.retryAfter, '秒');
    } finally {
      // 清理測試資料
      await cleanupTestData(testEmail);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - 缺少必要欄位 (name)",
  async fn() {
    const result = await callRegisterAPI({
      email: 'test@example.com',
      password: 'TestPass123',
      confirmPassword: 'TestPass123',
      // 缺少 name
    });

    assertEquals(result.status, 400, '應該返回 400 狀態碼');
    assertEquals(result.data.success, false, '應該返回 success: false');
    assertEquals(result.data.error.code, 'MISSING_FIELDS', '錯誤代碼應該是 MISSING_FIELDS');

    console.log('✅ 缺少必要欄位測試通過');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "註冊 API - Email 大小寫不敏感",
  async fn() {
    const testEmail = 'Test-Case-Sensitive@Example.COM';
    
    // 清理測試資料
    await cleanupTestData(testEmail);

    try {
      // 發送註冊請求
      const result = await callRegisterAPI({
        name: '測試使用者',
        email: testEmail,
        password: 'TestPass123',
        confirmPassword: 'TestPass123',
      });

      assertEquals(result.status, 200, '應該註冊成功');
      
      // 驗證 email 被轉換為小寫儲存
      const { data: verificationCode } = await supabase
        .from('verification_codes')
        .select('email')
        .eq('email', testEmail.toLowerCase())
        .single();

      assertEquals(
        verificationCode?.email,
        testEmail.toLowerCase(),
        'Email 應該被轉換為小寫儲存'
      );

      console.log('✅ Email 大小寫處理測試通過');
    } finally {
      // 清理測試資料
      await cleanupTestData(testEmail);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

console.log('\n📝 測試完成!\n');
console.log('執行方式:');
console.log('  deno test backend/tests/integration/register.test.ts --allow-net --allow-env\n');
