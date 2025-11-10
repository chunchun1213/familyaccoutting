# 快速開始指南 🚀

本指南幫助您快速啟動並測試家庭記帳應用程式。

## 前置需求

所有必要工具已安裝:
- ✅ Flutter 3.35.7
- ✅ Deno 2.5.6
- ✅ Supabase CLI 2.54.11
- ✅ Docker Desktop (正在運行)

## 5 分鐘快速啟動

### 步驟 1: 啟動後端服務

```bash
cd backend
supabase status
```

如果服務未運行,執行:
```bash
supabase start
```

預期輸出:
```
API URL: http://127.0.0.1:54321
Studio URL: http://127.0.0.1:54323
Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Mailpit URL: http://127.0.0.1:54324
```

### 步驟 2: 啟動前端應用程式

在新終端機視窗:

```bash
cd frontend

# 方式 1: Chrome 瀏覽器 (最快)
export PATH="$HOME/flutter/bin:$HOME/.deno/bin:$PATH"
flutter run -d chrome

# 方式 2: iOS 模擬器
flutter run -d ios

# 方式 3: Android 模擬器
flutter run -d android
```

### 步驟 3: 測試應用程式

#### 🔐 測試註冊流程 (2 分鐘)

1. **點擊「立即註冊」**
2. **填寫註冊表單**:
   - 姓名: `王小明`
   - Email: `test@example.com`
   - 密碼: `Test1234`
   - 確認密碼: `Test1234`
3. **點擊「註冊」**
4. **查看驗證碼**:
   - 方式 1: 開啟 http://127.0.0.1:54324 (Mailpit)
   - 方式 2: 查看終端機輸出
5. **輸入 6 位數驗證碼**
6. **點擊「驗證」** → 自動登入成功! ✅

#### 💰 測試記帳功能 (2 分鐘)

1. **查看財務概覽**:
   - 總收入: ¥0.00
   - 總支出: ¥0.00
   - 結餘: ¥0.00

2. **新增支出記錄**:
   - 點擊「新增記錄」按鈕
   - 選擇「支出」
   - 類別: `餐飲`
   - 金額: `250`
   - 備註: `午餐`
   - 點擊「儲存」

3. **新增收入記錄**:
   - 點擊「新增記錄」按鈕
   - 選擇「收入」
   - 類別: `薪水`
   - 金額: `50000`
   - 備註: `11月薪水`
   - 點擊「儲存」

4. **查看更新後的財務概覽**:
   - 總收入: ¥50,000.00 (綠色)
   - 總支出: ¥250.00 (紅色)
   - 結餘: ¥49,750.00 (藍色)

5. **查看交易列表**:
   - 最新記錄在最上方
   - 收入顯示 +¥50,000.00 (綠色)
   - 支出顯示 -¥250.00 (紅色)

#### 🔑 測試登出與登入 (1 分鐘)

1. **登出**:
   - 點擊右上角登出圖示
   - 確認登出

2. **登入**:
   - Email: `test@example.com`
   - 密碼: `Test1234`
   - 點擊「登入」
   - 自動載入之前的資料 ✅

## 開發工具

### Supabase Studio (資料庫管理)

1. 開啟 http://127.0.0.1:54323
2. 功能:
   - **Table Editor**: 查看/編輯資料表
   - **SQL Editor**: 執行 SQL 查詢
   - **API Docs**: 自動產生的 API 文件
   - **Authentication**: 使用者管理

### Mailpit (Email 測試)

1. 開啟 http://127.0.0.1:54324
2. 查看所有發送的 Email
3. 複製驗證碼

### Flutter DevTools

在終端機按 `o` 開啟 DevTools:
- Widget Inspector
- Timeline
- Memory
- Network
- Logging

## API 測試

### 使用 curl 測試後端 API

```bash
# 1. 註冊
curl -X POST http://127.0.0.1:54321/functions/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試使用者",
    "email": "api-test@example.com",
    "password": "Test1234",
    "confirmPassword": "Test1234"
  }'

# 2. 查看驗證碼 (開啟 http://127.0.0.1:54324)

# 3. 驗證 Email
curl -X POST http://127.0.0.1:54321/functions/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-test@example.com",
    "code": "123456",
    "name": "測試使用者",
    "password": "Test1234"
  }'

# 4. 登入
curl -X POST http://127.0.0.1:54321/functions/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-test@example.com",
    "password": "Test1234"
  }'

# 5. 新增交易 (需要 Token)
curl -X POST http://127.0.0.1:54321/functions/v1/accounting/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "expense",
    "category": "餐飲",
    "amount": 100.50,
    "note": "測試記錄"
  }'

# 6. 查詢交易記錄
curl -X GET http://127.0.0.1:54321/functions/v1/accounting/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. 財務概覽
curl -X GET http://127.0.0.1:54321/functions/v1/accounting/summary?period=month \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 常見問題

### Q: Supabase 服務無法啟動

```bash
# 檢查 Docker 是否運行
docker ps

# 如果 Docker 未運行,啟動 Docker Desktop

# 重新啟動 Supabase
cd backend
supabase stop
supabase start
```

### Q: Flutter 應用程式無法啟動

```bash
# 清理並重新建置
cd frontend
flutter clean
flutter pub get
flutter run -d chrome
```

### Q: 驗證碼收不到

**方式 1: 開啟 Mailpit**
```
http://127.0.0.1:54324
```

**方式 2: 查看 Supabase logs**
```bash
cd backend
supabase functions logs
```

**方式 3: 查看資料庫**
```
http://127.0.0.1:54323 → Table Editor → verification_codes
```

### Q: 資料庫需要重置

```bash
cd backend
supabase db reset
```

這會:
- 清空所有資料
- 重新執行遷移
- 回到初始狀態

### Q: API 回應 401 Unauthorized

**原因**: Token 過期或無效

**解決**:
1. 重新登入取得新 Token
2. 檢查 Token 是否正確傳遞
3. 確認環境變數設定正確

### Q: 編譯錯誤

```bash
# 重新產生程式碼
cd frontend
dart run build_runner build --delete-conflicting-outputs
flutter pub get
```

## 開發熱鍵

### Flutter 熱鍵 (在終端機中)

- `r` - 熱重載 (Hot Reload)
- `R` - 熱重啟 (Hot Restart)
- `o` - 開啟 DevTools
- `p` - 切換效能覆蓋層
- `q` - 退出

### VS Code 快捷鍵

- `Cmd+S` / `Ctrl+S` - 儲存並自動格式化
- `Cmd+Shift+P` - 命令面板
  - Flutter: Hot Reload
  - Flutter: Hot Restart
  - Flutter: Launch DevTools

## 效能提示

### 開發建議

1. **使用 Chrome 開發最快**:
   ```bash
   flutter run -d chrome
   ```

2. **啟用 Hot Reload**:
   - 儲存檔案自動重載
   - 保留應用程式狀態

3. **使用 Flutter DevTools**:
   - 監控效能
   - 檢查 Widget 樹
   - 查看網路請求

### 生產建置

```bash
cd frontend

# Android APK
flutter build apk --release

# iOS IPA (需要 Mac)
flutter build ios --release

# Web
flutter build web --release
```

## 下一步

### 1. 探索程式碼

```bash
# 前端程式碼
frontend/lib/

# 後端程式碼
backend/supabase/functions/

# 資料庫遷移
backend/supabase/migrations/
```

### 2. 閱讀文件

- [功能規格](./specs/001-member-accounting/spec.md)
- [實作計畫](./specs/001-member-accounting/plan.md)
- [任務清單](./specs/001-member-accounting/tasks.md)
- [後端完成報告](./BACKEND_COMPLETE.md)
- [前端完成報告](./FRONTEND_IMPLEMENTATION_COMPLETE.md)

### 3. 繼續開發

```bash
# Phase 8: 離線支援
# Phase 9: 打磨與優化

./speckit.implement
```

### 4. 部署到生產環境

參閱 [部署指南](./DEPLOYMENT.md) (待建立)

## 專案資源

- **API 文件**: http://127.0.0.1:54323 → API Docs
- **資料庫管理**: http://127.0.0.1:54323 → Table Editor
- **Email 測試**: http://127.0.0.1:54324
- **API Base URL**: http://127.0.0.1:54321/functions/v1

## 支援

遇到問題? 參考:
- [實作狀態](./IMPLEMENTATION_STATUS.md)
- [環境設定](./SETUP.md)
- [常見問題](./FAQ.md)

---

**🎉 享受您的家庭記帳應用程式!**
