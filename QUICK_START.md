# 快速開始指南

本指南協助您快速開始使用和測試已完成的後端 API。

## 當前狀態

✅ **後端 100% 完成** - 可立即測試  
⏳ **前端待實作** - 需安裝 Flutter SDK

## 快速測試後端 (5 分鐘)

### 步驟 1: 確認服務運行

```bash
# 確認 Supabase 服務狀態
cd backend
supabase status
```

應該看到所有服務都在運行中。

### 步驟 2: 測試註冊 API

```bash
# 使用測試腳本
./test_register.sh
```

或手動測試:

```bash
curl -X POST http://127.0.0.1:54321/functions/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試使用者",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

### 步驟 3: 查看驗證碼

開啟瀏覽器訪問 http://127.0.0.1:54324 (Mailpit) 查看驗證碼 Email。

### 步驟 4: 驗證 Email 並登入

```bash
# 替換 123456 為實際驗證碼
curl -X POST http://127.0.0.1:54321/functions/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "name": "測試使用者",
    "password": "TestPass123"
  }'
```

會收到包含 JWT Token 的回應。

### 步驟 5: 測試記帳 API

```bash
# 使用步驟 4 取得的 Token
TOKEN="your-jwt-token-here"

# 新增交易記錄
curl -X POST http://127.0.0.1:54321/functions/v1/accounting/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "category": "餐飲",
    "amount": 250.00,
    "note": "午餐"
  }'

# 查詢交易記錄
curl -X GET "http://127.0.0.1:54321/functions/v1/accounting/transactions" \
  -H "Authorization: Bearer $TOKEN"

# 財務概覽
curl -X GET "http://127.0.0.1:54321/functions/v1/accounting/summary?period=month" \
  -H "Authorization: Bearer $TOKEN"
```

## 使用圖形化工具

### Supabase Studio

開啟 http://127.0.0.1:54323

功能:
- 查看資料表內容
- 執行 SQL 查詢
- 查看 API 文件
- 管理使用者

### Postman/Insomnia

1. 建立新的 Collection
2. 匯入以下端點:

#### 註冊
- **POST** `http://127.0.0.1:54321/functions/v1/auth/register`
- Body (JSON):
  ```json
  {
    "name": "測試使用者",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }
  ```

#### 登入
- **POST** `http://127.0.0.1:54321/functions/v1/auth/login`
- Body (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "TestPass123"
  }
  ```

#### 新增交易 (需要 Token)
- **POST** `http://127.0.0.1:54321/functions/v1/accounting/transactions`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
  ```json
  {
    "type": "expense",
    "category": "餐飲",
    "amount": 250.00,
    "note": "午餐"
  }
  ```

## 安裝 Flutter 並實作前端

### macOS

```bash
# 1. 下載 Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter

# 2. 設定環境變數
export PATH="$PATH:$HOME/flutter/bin"
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.zshrc
source ~/.zshrc

# 3. 驗證安裝
flutter doctor

# 4. 接受 Android licenses (如需 Android 開發)
flutter doctor --android-licenses

# 5. 初始化前端專案
cd frontend
flutter create . --org com.familyaccounting --platforms ios,android
flutter pub get

# 6. 測試運行
flutter run
```

### Windows

```powershell
# 1. 從官網下載 Flutter SDK
# https://docs.flutter.dev/get-started/install/windows

# 2. 解壓縮到 C:\flutter

# 3. 添加到 PATH
# 系統 → 進階系統設定 → 環境變數 → Path → 新增 C:\flutter\bin

# 4. 驗證安裝
flutter doctor

# 5. 初始化專案 (同上)
```

### Linux

```bash
# 1. 下載 Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter

# 2. 設定環境變數
export PATH="$PATH:$HOME/flutter/bin"
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.bashrc
source ~/.bashrc

# 3. 安裝相依套件
sudo apt-get update
sudo apt-get install -y curl git unzip xz-utils zip libglu1-mesa

# 4. 驗證安裝 (同上)
flutter doctor
```

## 繼續實作前端

Flutter 安裝完成後:

```bash
cd /Users/chunchun/文件/speckit/familyaccoutting
./speckit.implement
```

系統會自動從前端實作任務開始。

## 常見問題

### Q: Supabase 服務沒有運行?

```bash
cd backend
supabase start
```

### Q: 找不到驗證碼?

開發環境下驗證碼會:
1. 顯示在 console 輸出
2. 發送到 Mailpit (http://127.0.0.1:54324)

### Q: API 請求失敗?

檢查:
1. Supabase 服務是否運行: `supabase status`
2. 請求格式是否正確
3. Token 是否有效 (JWT 有效期限)

### Q: 如何重置資料庫?

```bash
cd backend
supabase db reset
```

這會清空所有資料並重新套用遷移。

### Q: 如何查看資料庫內容?

方法 1: Supabase Studio  
開啟 http://127.0.0.1:54323 → Table Editor

方法 2: psql  
```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## 更多資訊

- 📄 [後端完成報告](./BACKEND_COMPLETE.md) - 完整的 API 測試範例
- 📄 [實作狀態](./IMPLEMENTATION_STATUS.md) - 詳細的進度追蹤
- 📄 [環境設定](./SETUP.md) - 完整的環境設定指南
- 📄 [功能規格](./specs/001-member-accounting/spec.md) - 功能需求文件
- 📄 [API 契約](./specs/001-member-accounting/contracts/) - OpenAPI 規格

## 技術支援

遇到問題?檢查以下資源:
- Flutter 官方文件: https://docs.flutter.dev
- Supabase 文件: https://supabase.com/docs
- Deno 文件: https://deno.land/manual

---

**🚀 開始測試或開發前端吧!**
