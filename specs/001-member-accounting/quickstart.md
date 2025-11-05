# 快速開始指南 - 會員註冊與登入系統以及記帳主頁功能

**功能分支**: `001-member-accounting`  
**最後更新**: 2025-11-05  
**狀態**: Phase 1 開發中

## 目錄

- [環境需求](#環境需求)
- [開發環境設定](#開發環境設定)
- [專案初始化](#專案初始化)
- [開發伺服器啟動](#開發伺服器啟動)
- [測試執行](#測試執行)
- [常見問題排解](#常見問題排解)
- [開發工作流程](#開發工作流程)

---

## 環境需求

在開始之前,請確保您的系統已安裝以下工具:

### 必需工具

| 工具 | 版本需求 | 用途 | 官方網站 |
|------|---------|------|---------|
| **Flutter SDK** | 3.16.0+ | 前端應用程式開發 | https://flutter.dev/docs/get-started/install |
| **Dart SDK** | 3.2.0+ (Flutter 自帶) | Flutter 執行時環境 | https://dart.dev/get-dart |
| **Deno** | 1.40.0+ | Supabase Edge Functions 執行 | https://deno.land/#installation |
| **Supabase CLI** | 1.127.0+ | 本地開發環境管理 | https://supabase.com/docs/guides/cli |
| **Git** | 2.30.0+ | 版本控制 | https://git-scm.com/downloads |
| **Node.js** | 18.0.0+ (選用) | 開發工具支援 | https://nodejs.org/ |

### 作業系統支援

- **macOS**: 11.0+ (Big Sur 或更新版本)
- **Windows**: 10+ (64-bit)
- **Linux**: Ubuntu 20.04+ 或同等版本

### 編輯器建議

- **VS Code** (推薦) 
  - 安裝擴充套件: Flutter, Dart, Supabase
- **Android Studio** (選用,適合 Android 開發)
- **Xcode** (macOS 用戶,適合 iOS 開發)

---

## 開發環境設定

### 步驟 1: 安裝 Flutter SDK

#### macOS / Linux

```bash
# 使用 Git 下載 Flutter SDK
git clone https://github.com/flutter/flutter.git -b stable ~/flutter

# 將 Flutter 加入 PATH (加入到 ~/.zshrc 或 ~/.bashrc)
export PATH="$PATH:$HOME/flutter/bin"

# 重新載入設定
source ~/.zshrc  # 或 source ~/.bashrc

# 驗證安裝
flutter doctor
```

#### Windows

1. 下載 Flutter SDK: https://flutter.dev/docs/get-started/install/windows
2. 解壓縮到 `C:\src\flutter`
3. 將 `C:\src\flutter\bin` 加入系統環境變數 PATH
4. 開啟新的命令提示字元視窗,執行 `flutter doctor`

### 步驟 2: 驗證 Flutter 環境

```bash
# 執行 Flutter Doctor 檢查環境
flutter doctor -v

# 確認輸出包含以下項目:
# ✓ Flutter (Channel stable, 3.16.x)
# ✓ Dart (version 3.2.x)
# ✓ Android toolchain (Android SDK version 34.x)
# ✓ Xcode (macOS only, version 15.x)
# ✓ Chrome (version 120.x)
```

**注意**: `flutter doctor` 可能顯示一些可選警告(如 Android Studio 未安裝),這不會影響本專案開發。

### 步驟 3: 安裝 Supabase CLI

#### macOS

```bash
# 使用 Homebrew 安裝
brew install supabase/tap/supabase

# 驗證安裝
supabase --version
```

#### Windows

```powershell
# 使用 Scoop 安裝
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 驗證安裝
supabase --version
```

#### Linux

```bash
# 使用 Homebrew on Linux
brew install supabase/tap/supabase

# 或使用 npm (需先安裝 Node.js)
npm install -g supabase

# 驗證安裝
supabase --version
```

### 步驟 4: 安裝 Deno

#### macOS / Linux

```bash
# 使用安裝腳本
curl -fsSL https://deno.land/install.sh | sh

# 將 Deno 加入 PATH (加入到 ~/.zshrc 或 ~/.bashrc)
export PATH="$HOME/.deno/bin:$PATH"

# 重新載入設定
source ~/.zshrc  # 或 source ~/.bashrc

# 驗證安裝
deno --version
```

#### Windows

```powershell
# 使用 PowerShell 安裝
irm https://deno.land/install.ps1 | iex

# 驗證安裝
deno --version
```

### 步驟 5: 設定 VS Code (推薦)

```bash
# 安裝必要的 VS Code 擴充套件
code --install-extension Dart-Code.flutter
code --install-extension Dart-Code.dart-code
code --install-extension supabase.supabase-vscode
```

---

## 專案初始化

### 步驟 1: Clone 專案

```bash
# Clone Git 儲存庫
git clone https://github.com/your-org/familyaccoutting.git

# 進入專案目錄
cd familyaccoutting

# 切換到功能分支
git checkout 001-member-accounting
```

### 步驟 2: 安裝 Flutter 相依套件

```bash
# 安裝專案相依套件
flutter pub get

# 產生程式碼(如需要)
flutter pub run build_runner build --delete-conflicting-outputs
```

### 步驟 3: 初始化 Supabase 本地環境

```bash
# 啟動 Supabase 本地開發環境(Docker 容器)
supabase start

# 預期輸出範例:
# Started supabase local development setup.
# 
#          API URL: http://localhost:54321
#      GraphQL URL: http://localhost:54321/graphql/v1
#           DB URL: postgresql://postgres:postgres@localhost:54322/postgres
#       Studio URL: http://localhost:54323
#     Inbucket URL: http://localhost:54324
#       JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
#         anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 將上述資訊儲存,後續設定需要使用
```

**重要**: 首次執行 `supabase start` 會下載 Docker 映像檔,可能需要 5-10 分鐘。

### 步驟 4: 執行資料庫遷移

```bash
# 套用資料庫遷移腳本
supabase db reset

# 或逐一套用遷移
supabase migration up

# 驗證資料表是否建立成功
supabase db diff
```

### 步驟 5: 設定環境變數

建立 `.env` 檔案(從 `.env.example` 複製):

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env 檔案
nano .env
```

`.env` 檔案內容範例:

```env
# Supabase 設定(從 supabase start 輸出取得)
# TODO: 部署至正式環境時,更新為正式專案的 Supabase 設定值
# 本地開發: 使用以下 localhost 值 (supabase start 輸出)
# 正式環境: 從 Supabase Project Settings > API 取得實際值
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email 發送服務
# 本地開發: 使用 Inbucket (測試用,可在 http://localhost:54324 查看郵件)
# 正式環境: 改用 resend,需設定 RESEND_API_KEY (從 https://resend.com/api-keys 取得)
EMAIL_PROVIDER=inbucket
INBUCKET_URL=http://localhost:54324
# RESEND_API_KEY=re_xxxxxxxxxx  # 正式環境時取消註解並填入實際 API Key

# JWT 設定
# TODO: 正式環境時,請產生強隨機值取代預設值
# 產生方式: openssl rand -base64 32
JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
JWT_EXPIRY=7d

# 應用程式設定
APP_ENV=development  # 正式環境改為 production
```

### 步驟 6: 部署 Edge Functions

```bash
# 部署所有 Edge Functions 到本地環境
supabase functions deploy

# 或逐一部署
supabase functions deploy register
supabase functions deploy verify-email
supabase functions deploy login
supabase functions deploy logout
supabase functions deploy get-transactions
supabase functions deploy create-transaction
supabase functions deploy get-summary

# 驗證部署成功
supabase functions list
```

---

## 開發伺服器啟動

### 啟動後端服務

```bash
# 確保 Supabase 本地環境正在執行
supabase status

# 若未執行,啟動它
supabase start

# 即時查看 Edge Functions 日誌
supabase functions serve --debug
```

**Supabase Studio**: 開啟瀏覽器前往 http://localhost:54323 管理資料庫

**Inbucket (Email 測試)**: 開啟 http://localhost:54324 查看測試郵件

### 啟動 Flutter 應用程式

#### 方式 1: 使用命令列

```bash
# 列出可用裝置
flutter devices

# 在 Chrome 執行
flutter run -d chrome

# 在 iOS 模擬器執行(macOS only)
flutter run -d ios

# 在 Android 模擬器執行
flutter run -d android
```

#### 方式 2: 使用 VS Code

1. 開啟專案根目錄
2. 按 `F5` 或點擊「Run and Debug」
3. 選擇目標裝置(Chrome / iOS / Android)
4. 點擊「Start Debugging」

#### 方式 3: 熱重載開發模式

```bash
# 啟動熱重載模式(修改程式碼自動重新載入)
flutter run --hot

# 在應用程式執行時:
# 按 'r' 熱重載(hot reload)
# 按 'R' 熱重啟(hot restart)
# 按 'q' 退出
```

---

## 測試執行

### 單元測試

```bash
# 執行所有單元測試
flutter test

# 執行特定測試檔案
flutter test test/models/user_test.dart

# 執行測試並產生覆蓋率報告
flutter test --coverage

# 查看覆蓋率報告(需安裝 lcov)
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

### 整合測試

```bash
# 執行整合測試
flutter test integration_test

# 在特定裝置執行整合測試
flutter test integration_test/app_test.dart -d chrome
```

### API 測試

```bash
# 使用 Supabase CLI 測試 Edge Functions
supabase functions serve

# 在另一個終端執行測試
curl -X POST http://localhost:54321/functions/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "王小明",
    "email": "test@example.com",
    "password": "MyPass123",
    "confirmPassword": "MyPass123"
  }'
```

### 端到端測試(E2E)

```bash
# 執行完整的端到端測試流程
flutter drive \
  --driver=test_driver/integration_test.dart \
  --target=integration_test/e2e_test.dart
```

---

## 常見問題排解

### 問題 1: `flutter doctor` 顯示 Android licenses 未接受

**症狀**:
```
[!] Android toolchain - develop for Android devices
    ✗ Android licenses not accepted
```

**解決方式**:
```bash
flutter doctor --android-licenses
# 按 'y' 接受所有授權
```

---

### 問題 2: `supabase start` 失敗,提示 Docker 未執行

**症狀**:
```
Error: Cannot connect to the Docker daemon
```

**解決方式**:
```bash
# macOS: 啟動 Docker Desktop
open -a Docker

# Linux: 啟動 Docker 服務
sudo systemctl start docker

# 等待 Docker 完全啟動後重試
supabase start
```

---

### 問題 3: Flutter 應用程式無法連線到 Supabase

**症狀**:
```
SocketException: Failed to connect to localhost:54321
```

**解決方式**:

1. 確認 Supabase 正在執行:
```bash
supabase status
```

2. 檢查 `.env` 檔案的 `SUPABASE_URL` 是否正確:
```env
SUPABASE_URL=http://localhost:54321
```

3. 若使用 Android 模擬器,將 `localhost` 改為 `10.0.2.2`:
```env
SUPABASE_URL=http://10.0.2.2:54321
```

---

### 問題 4: Edge Functions 部署失敗

**症狀**:
```
Error: Failed to deploy function: Invalid function code
```

**解決方式**:

1. 驗證 Deno 程式碼語法:
```bash
deno check supabase/functions/register/index.ts
```

2. 檢查函式相依套件:
```bash
cd supabase/functions/register
deno cache --reload index.ts
```

3. 重新部署:
```bash
supabase functions deploy register --no-verify-jwt
```

---

### 問題 5: 驗證碼 Email 未收到(開發環境)

**症狀**:
註冊後未收到驗證碼郵件

**解決方式**:

1. 開啟 Inbucket 查看測試郵件:
```bash
# 開啟瀏覽器
open http://localhost:54324
```

2. 檢查 Edge Function 日誌:
```bash
supabase functions serve --debug
# 查看 register 函式的日誌輸出
```

3. 確認 `.env` 設定:
```env
EMAIL_PROVIDER=inbucket
INBUCKET_URL=http://localhost:54324
```

---

### 問題 6: `flutter pub get` 失敗

**症狀**:
```
Error: Failed to resolve dependencies
```

**解決方式**:

1. 清除快取:
```bash
flutter clean
rm -rf pubspec.lock
```

2. 重新安裝:
```bash
flutter pub get
```

3. 若仍失敗,檢查網路連線或使用國內映像源:
```bash
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
flutter pub get
```

---

### 問題 7: iOS 模擬器啟動失敗(macOS)

**症狀**:
```
Error: No iOS simulators available
```

**解決方式**:

1. 開啟 Xcode 並安裝 iOS 模擬器:
```bash
xcode-select --install
open -a Simulator
```

2. 建立新的模擬器:
```bash
# 列出可用的裝置類型
xcrun simctl list devicetypes

# 建立 iPhone 15 模擬器
xcrun simctl create "iPhone 15" "iPhone 15"
```

---

### 問題 8: 資料庫遷移失敗

**症狀**:
```
Error: Migration failed: relation "users" already exists
```

**解決方式**:

1. 重置資料庫:
```bash
supabase db reset
```

2. 若需保留資料,手動回滾:
```bash
supabase migration list
supabase migration down --version 20250105000001
```

---

## 開發工作流程

### 日常開發流程

```bash
# 1. 啟動 Supabase 本地環境
supabase start

# 2. 啟動 Edge Functions 即時重載
supabase functions serve --debug

# 3. 在另一個終端啟動 Flutter 熱重載
flutter run --hot

# 4. 開始開發!修改程式碼後:
#    - Flutter: 按 'r' 熱重載
#    - Edge Functions: 自動重載

# 5. 執行測試
flutter test

# 6. 提交變更
git add .
git commit -m "feat: implement user registration"
git push origin 001-member-accounting
```

### 程式碼品質檢查

```bash
# Flutter 程式碼格式化
flutter format .

# Dart 程式碼分析
flutter analyze

# 修正常見問題
dart fix --apply
```

### 資料庫管理

```bash
# 建立新遷移
supabase migration new add_new_field

# 檢視資料庫差異
supabase db diff

# 套用遷移
supabase migration up

# 回滾遷移
supabase migration down
```

### 除錯技巧

#### Flutter 除錯

```bash
# 啟用詳細日誌
flutter run --verbose

# 使用 DevTools
flutter pub global activate devtools
flutter pub global run devtools

# 檢視 Widget 樹
在 VS Code 中按 Shift+Cmd+P (macOS) 或 Shift+Ctrl+P (Windows/Linux)
輸入 "Flutter: Toggle Debug Painting"
```

#### Edge Functions 除錯

```bash
# 查看即時日誌
supabase functions serve --debug

# 使用 console.log 除錯
在函式程式碼中加入:
console.log('Debug info:', data)

# 檢視 Supabase 日誌
supabase logs
```

---

## 開發環境完整檢查清單

在開始開發前,確保以下項目全部完成:

- [ ] Flutter SDK 已安裝且版本 >= 3.16.0
- [ ] Deno 已安裝且版本 >= 1.40.0
- [ ] Supabase CLI 已安裝且版本 >= 1.127.0
- [ ] Docker Desktop 已安裝並執行
- [ ] Git 已安裝並設定
- [ ] VS Code 已安裝 Flutter 和 Dart 擴充套件
- [ ] `flutter doctor` 無關鍵錯誤
- [ ] `supabase start` 成功啟動
- [ ] 資料庫遷移已套用
- [ ] Edge Functions 已部署
- [ ] `.env` 檔案已設定
- [ ] `flutter pub get` 成功安裝相依套件
- [ ] Flutter 應用程式可成功啟動
- [ ] 單元測試可執行
- [ ] 可存取 Supabase Studio (http://localhost:54323)
- [ ] 可存取 Inbucket (http://localhost:54324)

---

## 參考資源

### 官方文件

- **Flutter**: https://flutter.dev/docs
- **Supabase**: https://supabase.com/docs
- **Deno**: https://deno.land/manual

### 專案相關文件

- [功能規格](./spec.md)
- [資料模型](./data-model.md)
- [API 文件 - 認證](./contracts/api-auth.yaml)
- [API 文件 - 記帳](./contracts/api-accounting.yaml)

### 社群支援

- Flutter 中文社群: https://flutter.cn
- Supabase Discord: https://discord.supabase.com
- 專案 Issue 追蹤: https://github.com/your-org/familyaccoutting/issues

---

## 聯絡資訊

如遇到問題或需要協助,請聯絡:

- **技術支援**: dev@familyaccounting.com
- **專案負責人**: [您的名字]
- **Slack 頻道**: #familyaccounting-dev

---

**祝開發順利!** 🚀
