# 後端測試指南

## 🧪 測試註冊 API

### 前置準備

1. **啟動 Supabase 本地環境**
   ```bash
   cd backend/supabase
   supabase start
   ```

2. **確認環境變數設定正確**
   
   檢查 `.env` 檔案中的設定:
   ```env
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 執行測試

#### 方法 1: 使用測試腳本 (推薦)

```bash
# 給予執行權限
chmod +x backend/test-register.sh

# 執行測試
./backend/test-register.sh
```

#### 方法 2: 直接使用 Deno

```bash
deno test \
  backend/tests/integration/register.test.ts \
  --allow-net \
  --allow-env \
  --allow-read \
  --no-check
```

### 測試涵蓋範圍

✅ **成功場景**
- 成功註冊並發送驗證碼
- Email 大小寫不敏感處理

✅ **驗證錯誤**
- Email 格式錯誤
- 密碼不符合規則 (缺少大寫字母)
- 密碼不符合規則 (長度不足)
- 密碼與確認密碼不一致
- 缺少必要欄位

✅ **業務邏輯錯誤**
- Email 已被註冊 (409 Conflict)
- 請求頻率限制 (429 Too Many Requests)

### 測試輸出範例

```
註冊 API - 成功註冊並發送驗證碼 ... ok (234ms)
✅ 成功註冊測試通過
   生成的驗證碼: 123456

註冊 API - Email 格式錯誤 ... ok (12ms)
✅ Email 格式錯誤測試通過

註冊 API - 密碼不符合規則 (缺少大寫字母) ... ok (15ms)
✅ 密碼格式錯誤測試通過

...

test result: ok. 9 passed; 0 failed; 0 ignored (1234ms)
```

### 手動測試

如果想手動測試 API,可以使用以下 curl 命令:

```bash
# 成功註冊
curl -X POST http://127.0.0.1:54321/functions/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "name": "測試使用者",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'

# Email 格式錯誤
curl -X POST http://127.0.0.1:54321/functions/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "name": "測試使用者",
    "email": "invalid-email",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

### 資料庫檢查

測試後可以直接查詢資料庫驗證:

```sql
-- 查看驗證碼記錄
SELECT * FROM verification_codes 
WHERE email = 'test@example.com' 
ORDER BY created_at DESC 
LIMIT 1;

-- 查看使用者記錄
SELECT * FROM users 
WHERE email = 'test@example.com';
```

### 故障排除

**問題 1: 連線失敗**
```
Error: Connection refused
```
解決方式: 確認 Supabase 已啟動
```bash
cd backend/supabase
supabase status
```

**問題 2: 認證失敗**
```
Error: Invalid API key
```
解決方式: 檢查 `.env` 中的 `SUPABASE_SERVICE_ROLE_KEY`

**問題 3: 測試資料未清理**
```
Error: Email already exists
```
解決方式: 手動清理測試資料
```bash
supabase db reset
```

### 下一步

- ✅ 註冊 API 測試完成
- ⏳ 繼續測試驗證 Email API (`verify-email.test.ts`)
- ⏳ 繼續測試登入 API (`login.test.ts`)
- ⏳ 繼續測試登出 API (`logout.test.ts`)
