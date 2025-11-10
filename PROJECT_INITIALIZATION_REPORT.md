# 家庭記帳 APP 專案初始化報告

> 報告日期：2025-11-10
> 專案名稱：familyaccounting
> 狀態：✅ 初始化完成

---

## 📋 目錄

1. [專案概覽](#專案概覽)
2. [開發環境配置](#開發環境配置)
3. [專案結構](#專案結構)
4. [初始化步驟總結](#初始化步驟總結)
5. [環境變數配置](#環境變數配置)
6. [資料庫結構](#資料庫結構)
7. [快速開始指令](#快速開始指令)
8. [本地開發 vs 生產環境](#本地開發-vs-生產環境)
9. [上線部署步驟](#上線部署步驟)
10. [重要連結](#重要連結)
11. [常見問題](#常見問題)

---

## 專案概覽

### 專案資訊

- **專案名稱**：家庭記帳 APP
- **專案路徑**：`/Users/chunchun/文件/speckit/familyaccoutting`
- **前端技術**：Flutter 3.35.7
- **後端技術**：Supabase (PostgreSQL + REST API)
- **狀態管理**：Riverpod 3.0.3
- **組織 ID**：com.familyaccounting
- **支援平台**：iOS, Android

### 專案目標

開發一個功能完整的家庭記帳應用，包含：
- ✅ 會員註冊與登入系統
- ✅ 手機驗證碼驗證
- ✅ Session 管理
- ✅ 記帳主頁功能
- ✅ 交易記錄管理

---

## 開發環境配置

### 1. Flutter 環境

**版本資訊**：
```
Flutter: 3.35.7 (stable channel)
Dart: 3.9.2
DevTools: 2.48.0
```

**環境檢查結果**：
```
✓ Flutter (Channel stable, 3.35.7)
✓ Android toolchain (Android SDK version 35.0.1)
✓ Xcode (Xcode 15.4)
✓ Chrome
✓ Android Studio (version 2024.2)
✓ VS Code (version 1.105.1)
✓ Connected device (3 available)
✓ Network resources
• No issues found!
```

**環境變數配置**：
- 已添加到 `~/.bash_profile:34`
- 已添加到 `~/.zshrc:7`
- PATH: `$HOME/flutter/bin`

### 2. Deno 環境

**版本資訊**：
```
Deno: 2.5.6 (stable, release, aarch64-apple-darwin)
V8: 14.0.365.5-rusty
TypeScript: 5.9.2
```

**安裝位置**：`/Users/chunchun/.deno/bin/deno`

**環境變數配置**：
- 已添加到 `~/.bash_profile:37-38`
- 已添加到 `~/.zshrc:10-11`
- DENO_INSTALL: `$HOME/.deno`
- PATH: `$DENO_INSTALL/bin`

### 3. Supabase CLI

**版本資訊**：
```
Supabase CLI: 2.54.11
```

**安裝方式**：Homebrew (`supabase/tap/supabase`)

**安裝位置**：`/usr/local/bin/supabase`

**功能**：
- ✓ 本地開發環境管理
- ✓ 資料庫遷移管理
- ✓ Edge Functions 開發
- ✓ TypeScript 類型生成
- ✓ Bash 自動補全

### 4. Docker Desktop

**版本資訊**：
```
Docker: 28.5.1 (build e180ab8)
Docker Compose: v2.40.3-desktop.1
```

**系統資源**：
- CPUs: 12
- Total Memory: 7.653 GiB
- Operating System: Docker Desktop

**環境變數配置**：
- 已添加到 `~/.bash_profile:40-41`
- 已添加到 `~/.zshrc:13-14`
- PATH: `/Applications/Docker.app/Contents/Resources/bin`

---

## 專案結構

```
familyaccoutting/                          ← 專案根目錄
├── .env                                   ← 環境變數（本地開發）
├── .env.example                           ← 環境變數範本
├── .gitignore                             ← Git 忽略檔案
├── README.md                              ← 專案說明
├── SETUP.md                               ← 設定指南
├── IMPLEMENTATION_STATUS.md               ← 實作狀態
├── NEXT_STEPS.md                          ← 下一步計畫
│
├── frontend/                              ← Flutter 前端應用
│   ├── lib/                               ← 應用程式碼
│   │   └── main.dart                      ← 應用程式入口
│   ├── test/                              ← 測試檔案
│   ├── android/                           ← Android 平台配置
│   ├── ios/                               ← iOS 平台配置
│   ├── pubspec.yaml                       ← Flutter 依賴配置
│   ├── analysis_options.yaml              ← 程式碼分析規則
│   └── .gitignore
│
├── backend/                               ← Supabase 後端
│   ├── supabase/
│   │   ├── config.toml                    ← Supabase 配置
│   │   ├── migrations/                    ← 資料庫遷移
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_verification_codes.sql
│   │   │   ├── 003_create_sessions.sql
│   │   │   └── 004_create_transactions.sql
│   │   ├── functions/                     ← Edge Functions
│   │   └── seed/                          ← 種子資料
│   └── tests/                             ← 後端測試
│
├── doc/                                   ← 文檔目錄
└── specs/                                 ← 規格文件
```

---

## 初始化步驟總結

### ✅ 步驟 1: Flutter 專案初始化

**完成日期**：2025-11-10

**執行的操作**：
```bash
cd /Users/chunchun/文件/speckit/familyaccoutting/frontend
flutter create . --org com.familyaccounting --platforms ios,android
flutter pub upgrade --major-versions
flutter pub get
```

**結果**：
- ✓ 創建 74 個檔案（iOS/Android 配置、範例程式碼）
- ✓ 安裝 133 個依賴套件
- ✓ 升級所有套件到最新版本
- ✓ 解決版本衝突（intl 套件）
- ✓ Flutter doctor 檢查通過

**已安裝的關鍵套件**：

| 類別 | 套件名稱 | 版本 | 用途 |
|------|---------|------|------|
| 狀態管理 | flutter_riverpod | ^3.0.3 | 應用狀態管理 |
| 狀態管理 | riverpod_annotation | ^3.0.3 | Riverpod 代碼生成 |
| HTTP | dio | ^5.9.0 | HTTP 請求客戶端 |
| 儲存 | flutter_secure_storage | ^10.0.0-beta.4 | 安全儲存（Token等） |
| 儲存 | shared_preferences | ^2.5.3 | 本地偏好設定 |
| 表單 | flutter_form_builder | ^10.2.0 | 表單建構 |
| 表單 | form_builder_validators | ^11.2.0 | 表單驗證 |
| UI | cupertino_icons | ^1.0.8 | iOS 風格圖示 |
| 工具 | freezed_annotation | ^3.1.0 | 不可變類別 |
| 工具 | json_annotation | ^4.9.0 | JSON 序列化 |

**開發工具套件**：

| 套件名稱 | 版本 | 用途 |
|---------|------|------|
| build_runner | ^2.7.1 | 程式碼生成 |
| freezed | ^3.2.3 | 不可變類別生成 |
| json_serializable | ^6.11.1 | JSON 序列化生成 |
| riverpod_generator | ^3.0.3 | Riverpod 生成器 |
| mockito | ^5.5.0 | Mock 測試 |
| flutter_lints | ^6.0.0 | 程式碼規範 |

### ✅ 步驟 2: Supabase 初始化

**完成日期**：2025-11-10

**執行的操作**：
```bash
cd /Users/chunchun/文件/speckit/familyaccoutting/backend
supabase start
```

**結果**：
- ✓ 下載 Supabase Docker 鏡像
- ✓ 啟動 12 個服務容器
- ✓ 自動套用 4 個資料庫遷移
- ✓ 生成本地開發環境的 API 金鑰

**啟動的服務**：

| 服務名稱 | 版本 | 端口 | 狀態 | 用途 |
|---------|------|------|------|------|
| PostgreSQL | 15.8.1.085 | 54322 | ✓ healthy | 資料庫 |
| Kong | 2.8.1 | 54321 | ✓ healthy | API Gateway |
| GoTrue | v2.180.0 | - | ✓ healthy | 認證服務 |
| Realtime | v2.57.3 | - | ✓ healthy | 即時訂閱 |
| Storage API | v1.28.2 | - | ✓ healthy | 檔案儲存 |
| PostgREST | v13.0.7 | - | ✓ running | REST API |
| Edge Runtime | v1.69.15 | - | ✓ running | Edge Functions |
| Postgres Meta | v0.93.1 | - | ✓ healthy | 資料庫管理 |
| Studio | 2025.10.27 | 54323 | ✓ healthy | Web 管理介面 |
| Analytics | 1.23.2 | 54327 | ✓ healthy | 分析服務 |
| Vector | 0.28.1 | - | ✓ healthy | 日誌收集 |
| Mailpit | v1.22.3 | 54324 | ✓ healthy | 郵件測試 |

### ✅ 步驟 3: 資料庫遷移套用

**完成日期**：2025-11-10

**執行的操作**：
- 遷移檔案在 `supabase start` 時自動套用
- 使用 `supabase db diff` 驗證

**已套用的遷移**：

| 遷移檔案 | 用途 | 狀態 |
|---------|------|------|
| 001_create_users.sql | 創建使用者表 | ✓ Applied |
| 002_create_verification_codes.sql | 創建驗證碼表 | ✓ Applied |
| 003_create_sessions.sql | 創建 Session 表 | ✓ Applied |
| 004_create_transactions.sql | 創建交易記錄表 | ✓ Applied |

**驗證結果**：
```bash
$ supabase db diff
No schema changes found ✓
```

### ✅ 步驟 4: 環境變數配置

**完成日期**：2025-11-10

**執行的操作**：
```bash
cd /Users/chunchun/文件/speckit/familyaccoutting
cp .env.example .env
# 填入 Supabase 啟動後的實際值
```

**已配置的關鍵值**：
- ✓ SUPABASE_URL: `http://localhost:54321`
- ✓ SUPABASE_ANON_KEY: `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH`
- ✓ SUPABASE_SERVICE_ROLE_KEY: `sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz`
- ✓ DB_URL: `postgresql://postgres:postgres@localhost:54322/postgres`
- ✓ EMAIL_PROVIDER: `inbucket`
- ✓ APP_ENV: `development`

---

## 環境變數配置

### 環境變數檔案位置

**主要檔案**：
- **本地開發**：`/Users/chunchun/文件/speckit/familyaccoutting/.env`
- **範本**：`/Users/chunchun/文件/speckit/familyaccoutting/.env.example`

### 本地開發環境變數 (.env)

```env
# ==========================================
# 本地開發環境配置
# ==========================================

# Supabase 設定（本地 Docker）
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz

# Email 發送服務（測試用）
EMAIL_PROVIDER=inbucket
INBUCKET_URL=http://localhost:54324

# JWT 設定（測試用）
JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
JWT_EXPIRY=7d

# 應用程式設定
APP_ENV=development
APP_NAME=家庭記帳APP
APP_VERSION=1.0.0

# 資料庫設定（本地 Docker）
DB_URL=postgresql://postgres:postgres@localhost:54322/postgres

# API 設定
API_TIMEOUT=10000
MAX_RETRY_ATTEMPTS=3

# 驗證碼設定
VERIFICATION_CODE_LENGTH=6
VERIFICATION_CODE_EXPIRY=300
VERIFICATION_CODE_MAX_ATTEMPTS=5
VERIFICATION_CODE_RESEND_COOLDOWN=60

# Session 設定
SESSION_EXPIRY=604800
MAX_SESSIONS_PER_USER=5

# 交易設定
MAX_TRANSACTION_AMOUNT=1000000.00
TRANSACTIONS_PER_PAGE=100
```

### 環境變數說明

| 變數名稱 | 本地開發值 | 生產環境值 | 說明 |
|---------|-----------|-----------|------|
| **SUPABASE_URL** | http://localhost:54321 | https://xxxxx.supabase.co | Supabase API 端點 |
| **SUPABASE_ANON_KEY** | 本地生成的 Key | 雲端專案的 anon key | 公開 API 金鑰 |
| **SUPABASE_SERVICE_ROLE_KEY** | 本地生成的 Key | 雲端專案的 service_role key | 服務端 API 金鑰 |
| **EMAIL_PROVIDER** | inbucket | resend | 郵件服務提供商 |
| **INBUCKET_URL** | http://localhost:54324 | - | 測試郵件服務 |
| **RESEND_API_KEY** | - | re_xxxxxxxxxx | Resend API 金鑰 |
| **JWT_SECRET** | 測試用簡單值 | openssl rand -base64 32 | JWT 簽名密鑰 |
| **APP_ENV** | development | production | 應用環境 |
| **DB_URL** | localhost:54322 | Supabase 雲端 DB | 資料庫連接字串 |

### 安全注意事項

⚠️ **重要提醒**：

1. **.env 檔案已在 .gitignore 中排除**
   - 永遠不要將 .env 檔案提交到版本控制
   - 敏感資訊（API 金鑰、密碼）會暴露

2. **本地開發密鑰僅供測試使用**
   - 當前的 Supabase 金鑰只能在本地電腦使用
   - 生產環境必須使用雲端專案的實際金鑰

3. **JWT_SECRET 在生產環境必須是強隨機值**
   - 使用 `openssl rand -base64 32` 生成
   - 永遠不要在多個環境間共用

4. **檔案權限設定**
   ```bash
   chmod 600 .env
   chmod 600 .env.production
   ```

---

## 資料庫結構

### 已創建的表格

#### 1. users（使用者表）

**檔案**：`migrations/001_create_users.sql`

**用途**：儲存使用者基本資訊

**主要欄位**：
- `id` (UUID, PK)
- `phone` (TEXT, UNIQUE) - 手機號碼
- `password_hash` (TEXT) - 加密後的密碼
- `is_verified` (BOOLEAN) - 是否已驗證
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**索引**：
- `phone` (UNIQUE) - 快速查找使用者

#### 2. verification_codes（驗證碼表）

**檔案**：`migrations/002_create_verification_codes.sql`

**用途**：儲存手機驗證碼

**主要欄位**：
- `id` (UUID, PK)
- `phone` (TEXT) - 手機號碼
- `code` (TEXT) - 驗證碼
- `expires_at` (TIMESTAMP) - 過期時間
- `is_used` (BOOLEAN) - 是否已使用
- `attempt_count` (INTEGER) - 嘗試次數
- `created_at` (TIMESTAMP)

**索引**：
- `phone, created_at` - 查找最新驗證碼

**特性**：
- 過期機制（300秒）
- 嘗試次數限制（5次）
- 使用後標記為已用

#### 3. sessions（Session 表）

**檔案**：`migrations/003_create_sessions.sql`

**用途**：儲存使用者登入會話

**主要欄位**：
- `id` (UUID, PK)
- `user_id` (UUID, FK) - 外鍵關聯 users
- `token` (TEXT, UNIQUE) - Session Token
- `expires_at` (TIMESTAMP) - 過期時間
- `device_info` (JSONB) - 裝置資訊
- `is_active` (BOOLEAN) - 是否啟用
- `last_activity_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

**索引**：
- `token` (UNIQUE) - 快速驗證 Token
- `user_id, is_active` - 查找使用者的活躍 Session

**特性**：
- Session 過期機制（7天）
- 記錄裝置資訊
- 最後活動時間追蹤
- 支援多裝置登入

#### 4. transactions（交易記錄表）

**檔案**：`migrations/004_create_transactions.sql`

**用途**：儲存家庭記帳交易記錄

**主要欄位**：
- `id` (UUID, PK)
- `user_id` (UUID, FK) - 外鍵關聯 users
- `amount` (DECIMAL) - 金額
- `type` (TEXT) - 類型（income/expense）
- `category` (TEXT) - 分類
- `description` (TEXT) - 描述
- `transaction_date` (DATE) - 交易日期
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**索引**：
- `user_id, transaction_date` - 查詢使用者的交易
- `user_id, category` - 按分類查詢

**特性**：
- 支援收入/支出兩種類型
- 可自訂分類
- 記錄交易日期與創建日期

### 資料庫 ER 圖

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │───┐
│ phone       │   │
│ password    │   │
│ is_verified │   │
│ timestamps  │   │
└─────────────┘   │
                  │ (1:N)
                  │
     ┌────────────┼────────────┐
     │            │            │
     ▼            ▼            ▼
┌────────────┐ ┌───────────┐ ┌────────────────┐
│  sessions  │ │ trans...  │ │ verification_  │
├────────────┤ ├───────────┤ │     codes      │
│ id (PK)    │ │ id (PK)   │ ├────────────────┤
│ user_id(FK)│ │user_id(FK)│ │ phone          │
│ token      │ │ amount    │ │ code           │
│ device_info│ │ type      │ │ expires_at     │
│ expires_at │ │ category  │ │ is_used        │
│ is_active  │ │ desc      │ │ attempt_count  │
└────────────┘ └───────────┘ └────────────────┘
```

### Row Level Security (RLS)

所有表格都應該啟用 RLS 政策（建議後續實作）：

```sql
-- 範例：users 表的 RLS 政策
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

---

## 快速開始指令

### Flutter 開發

```bash
# 進入前端目錄
cd ~/文件/speckit/familyaccoutting/frontend

# 檢查環境
flutter doctor

# 獲取依賴套件
flutter pub get

# 運行應用（選擇裝置）
flutter run

# iOS 模擬器
flutter run -d ios

# Android 模擬器
flutter run -d android

# 程式碼生成（Riverpod, Freezed, JSON）
flutter pub run build_runner build --delete-conflicting-outputs

# 監聽模式（自動生成）
flutter pub run build_runner watch --delete-conflicting-outputs

# 程式碼分析
flutter analyze

# 執行測試
flutter test

# 建置 Release 版本
flutter build apk --release          # Android APK
flutter build appbundle --release    # Android App Bundle
flutter build ios --release          # iOS
```

### Supabase 管理

```bash
# 進入後端目錄
cd ~/文件/speckit/familyaccoutting/backend

# 啟動本地 Supabase
supabase start

# 查看服務狀態
supabase status

# 停止服務
supabase stop

# 重置資料庫（套用所有遷移）
supabase db reset

# 創建新的遷移檔案
supabase migration new <migration_name>

# 推送遷移到遠端
supabase db push

# 從遠端拉取結構
supabase db pull

# 比對本地與遠端差異
supabase db diff

# 生成 TypeScript 類型
supabase gen types typescript --local > lib/database.types.ts

# 打開 Supabase Studio
open http://127.0.0.1:54323
```

### Docker 管理

```bash
# 查看運行中的容器
docker ps

# 查看所有容器（包含停止的）
docker ps -a

# 查看 Supabase 容器
docker ps --filter "name=familyaccounting"

# 查看容器日誌
docker logs <container_name>

# 實時查看日誌
docker logs -f <container_name>

# 停止所有 Supabase 容器
docker stop $(docker ps -q --filter "name=familyaccounting")

# 查看 Docker Volume
docker volume ls --filter label=com.supabase.cli.project=familyaccounting-local

# 清理未使用的資源
docker system prune
```

### Git 工作流程

```bash
# 初始化（如果還沒有）
git init
git add .
git commit -m "Initial commit"

# 日常工作流程
git status                          # 查看狀態
git add .                          # 加入所有更改
git commit -m "描述更改內容"         # 提交
git push origin main               # 推送到遠端

# 分支操作
git checkout -b feature/new-feature  # 創建新分支
git checkout main                    # 切換回主分支
git merge feature/new-feature        # 合併分支

# 查看歷史
git log --oneline --graph --all
```

---

## 本地開發 vs 生產環境

### 環境對比

| 項目 | 本地開發環境 | 生產環境 |
|------|------------|---------|
| **目的** | 開發與測試 | 正式上線服務 |
| **資料庫** | Docker PostgreSQL (localhost:54322) | Supabase 雲端資料庫 |
| **API 端點** | http://localhost:54321 | https://xxxxx.supabase.co |
| **郵件服務** | Inbucket (假的，測試用) | Resend (真實寄送) |
| **JWT Secret** | 簡單測試值 | 強隨機值 (openssl rand -base64 32) |
| **APP_ENV** | development | production |
| **資料持久性** | Docker Volume (本地) | 雲端持久儲存 |
| **存取範圍** | 僅本機 | 全球任何地方 |
| **成本** | 完全免費 | Supabase 免費方案 + Resend 免費方案 |
| **效能** | 快速（本機） | 取決於網路與地區 |
| **安全性** | 測試用金鑰 | 生產級金鑰 |
| **備份** | 手動備份 Docker Volume | Supabase 自動備份 |

### 本地開發環境優勢

✅ **優點**：
- 完全離線開發
- 快速迭代測試
- 無需擔心 API 配額
- 資料完全私密
- 可以隨意測試破壞性操作

⚠️ **限制**：
- 資料僅在本機
- 無法測試真實網路環境
- 無法測試真實郵件發送
- 容器停止後資料可能遺失（如果刪除 Volume）

### 生產環境注意事項

✅ **優點**：
- 全球可存取
- 自動備份與容錯
- 專業級安全性
- 真實的使用者環境

⚠️ **注意**：
- 需要監控 API 使用量
- 需要配置備份策略
- 需要設定監控與告警
- 成本可能隨使用量增加

---

## 🚀 上線前必須調整的項目清單

本章節詳細列出從**本地開發環境**轉換到**生產環境**時，所有需要修改或調整的項目。

### ⚠️ 關鍵提醒

上線前必須完成以下調整，否則應用程式將無法正常運作或存在嚴重安全風險。

---

### 📝 調整清單總覽

| # | 項目 | 優先級 | 複雜度 | 預估時間 |
|---|------|--------|--------|---------|
| 1 | 創建 Supabase 雲端專案 | 🔴 必須 | 簡單 | 10 分鐘 |
| 2 | 更新環境變數檔案 | 🔴 必須 | 中等 | 20 分鐘 |
| 3 | 推送資料庫遷移到雲端 | 🔴 必須 | 簡單 | 5 分鐘 |
| 4 | 配置郵件服務 (Resend) | 🔴 必須 | 中等 | 15 分鐘 |
| 5 | 更新 Flutter 環境變數載入 | 🔴 必須 | 中等 | 30 分鐘 |
| 6 | 配置應用簽名 (iOS/Android) | 🔴 必須 | 複雜 | 1-2 小時 |
| 7 | 調整 API 逾時與重試設定 | 🟡 建議 | 簡單 | 10 分鐘 |
| 8 | 啟用錯誤追蹤服務 | 🟡 建議 | 中等 | 30 分鐘 |
| 9 | 配置 Row Level Security | 🟡 建議 | 複雜 | 1 小時 |
| 10 | 設定監控與告警 | 🟢 可選 | 簡單 | 15 分鐘 |

---

### 1️⃣ Supabase 雲端專案設定

#### ❌ 本地開發
```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

#### ✅ 生產環境
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg4ODg4ODgsImV4cCI6MjAwNDQ2NDg4OH0.xxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODg4ODg4OCwiZXhwIjoyMDA0NDY0ODg4fQ.xxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 📋 操作步驟

1. **創建 Supabase 專案**
   ```bash
   # 前往 https://supabase.com
   # 點擊 "New Project"
   # 填寫：
   #   - Name: familyaccounting
   #   - Database Password: [設定強密碼並記錄]
   #   - Region: Singapore (最接近台灣)
   #   - Plan: Free (或根據需求)
   ```

2. **獲取生產環境 API Keys**
   ```bash
   # 在 Supabase Dashboard:
   # Settings → API
   # 複製：
   #   - Project URL
   #   - anon public key
   #   - service_role key
   #   - Project ID (Settings → General)
   ```

3. **連結本地專案到雲端**
   ```bash
   cd ~/文件/speckit/familyaccoutting/backend
   supabase link --project-ref <your-project-id>
   # 輸入資料庫密碼
   ```

4. **推送資料庫遷移**
   ```bash
   supabase db push
   # 驗證
   supabase db diff  # 應顯示 "No schema changes found"
   ```

---

### 2️⃣ 環境變數檔案 (.env)

#### 📁 檔案位置
```
/Users/chunchun/文件/speckit/familyaccoutting/
├── .env                    ← 本地開發（不要提交到 Git）
├── .env.example            ← 範本（可提交）
└── .env.production         ← 生產環境（不要提交到 Git）★ 需要創建
```

#### ✏️ 創建 .env.production

```bash
cd ~/文件/speckit/familyaccoutting
cp .env.example .env.production
nano .env.production
```

#### 📝 必須修改的環境變數

| 變數名稱 | 本地開發值 | 生產環境值 | 如何取得 |
|---------|-----------|-----------|---------|
| **SUPABASE_URL** | `http://localhost:54321` | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API |
| **SUPABASE_ANON_KEY** | 本地生成的 Key | 雲端專案的 anon key | Supabase Dashboard → Settings → API |
| **SUPABASE_SERVICE_ROLE_KEY** | 本地生成的 Key | 雲端專案的 service_role key | Supabase Dashboard → Settings → API |
| **EMAIL_PROVIDER** | `inbucket` | `resend` | 註冊 https://resend.com |
| **INBUCKET_URL** | `http://localhost:54324` | ❌ 刪除此行 | - |
| **RESEND_API_KEY** | ❌ 未設定 | `re_xxxxxxxxxx` | Resend Dashboard → API Keys |
| **EMAIL_FROM** | ❌ 未設定 | `noreply@familyaccounting.app` | 使用你的域名 |
| **JWT_SECRET** | `super-secret-jwt-token...` | `K7gNU3sdo+OL0wNhqo...` | `openssl rand -base64 32` |
| **APP_ENV** | `development` | `production` | 手動修改 |
| **DB_URL** | `postgresql://postgres:postgres@localhost:54322/postgres` | `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres` | Supabase Dashboard → Settings → Database |

#### 🔐 生成強隨機 JWT_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# 輸出範例：
# K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=

# 複製結果並填入 .env.production 的 JWT_SECRET
```

#### 📄 完整的 .env.production 範例

```env
# ==========================================
# 生產環境配置
# ==========================================

# Supabase 設定（雲端）
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTc2MDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email 發送服務（真實發送）
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_Ab123456_XyZ789abcdefghijklmnopqrst
EMAIL_FROM=noreply@familyaccounting.app

# JWT 設定（強隨機值）
JWT_SECRET=K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
JWT_EXPIRY=7d

# 應用程式設定
APP_ENV=production
APP_NAME=家庭記帳APP
APP_VERSION=1.0.0

# 資料庫設定（雲端）
DB_URL=postgresql://postgres:your-strong-password@db.abcdefgh.supabase.co:5432/postgres

# API 設定（生產環境建議增加逾時）
API_TIMEOUT=15000  # 15 秒（本地是 10 秒）
MAX_RETRY_ATTEMPTS=5  # 增加重試次數

# 驗證碼設定（與本地相同）
VERIFICATION_CODE_LENGTH=6
VERIFICATION_CODE_EXPIRY=300
VERIFICATION_CODE_MAX_ATTEMPTS=5
VERIFICATION_CODE_RESEND_COOLDOWN=60

# Session 設定（與本地相同）
SESSION_EXPIRY=604800
MAX_SESSIONS_PER_USER=5

# 交易設定（與本地相同）
MAX_TRANSACTION_AMOUNT=1000000.00
TRANSACTIONS_PER_PAGE=100
```

---

### 3️⃣ Flutter 環境變數載入

#### 📦 安裝 flutter_dotenv 套件

```bash
cd ~/文件/speckit/familyaccoutting/frontend
flutter pub add flutter_dotenv
```

#### 📝 更新 pubspec.yaml

在 `pubspec.yaml` 中添加 assets：

```yaml
flutter:
  uses-material-design: true

  # 添加環境變數檔案
  assets:
    - ../.env                # 本地開發
    - ../.env.production     # 生產環境
```

**注意**：路徑是 `../.env` 因為 .env 在專案根目錄，而 pubspec.yaml 在 frontend/ 目錄

#### ✏️ 修改 lib/main.dart

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

Future<void> main() async {
  // 確保 Flutter binding 初始化
  WidgetsFlutterBinding.ensureInitialized();

  // 根據建置模式載入不同的環境變數
  final envFile = kReleaseMode ? '../.env.production' : '../.env';

  try {
    await dotenv.load(fileName: envFile);
    print('✓ 環境變數已載入: $envFile');
  } catch (e) {
    print('✗ 無法載入環境變數: $e');
    // 如果是生產環境，應該停止應用
    if (kReleaseMode) {
      throw Exception('生產環境必須配置 .env.production 檔案');
    }
  }

  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 驗證環境變數是否已載入
    final appEnv = dotenv.env['APP_ENV'] ?? 'unknown';
    final supabaseUrl = dotenv.env['SUPABASE_URL'] ?? '';

    print('當前環境: $appEnv');
    print('Supabase URL: $supabaseUrl');

    return MaterialApp(
      title: dotenv.env['APP_NAME'] ?? '家庭記帳APP',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(),
    );
  }
}
```

#### 📝 創建環境變數服務

創建 `lib/config/env_config.dart`：

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  // Supabase
  static String get supabaseUrl => dotenv.env['SUPABASE_URL'] ?? '';
  static String get supabaseAnonKey => dotenv.env['SUPABASE_ANON_KEY'] ?? '';
  static String get supabaseServiceRoleKey => dotenv.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

  // App
  static String get appEnv => dotenv.env['APP_ENV'] ?? 'development';
  static String get appName => dotenv.env['APP_NAME'] ?? '家庭記帳APP';
  static String get appVersion => dotenv.env['APP_VERSION'] ?? '1.0.0';

  // API
  static int get apiTimeout => int.tryParse(dotenv.env['API_TIMEOUT'] ?? '10000') ?? 10000;
  static int get maxRetryAttempts => int.tryParse(dotenv.env['MAX_RETRY_ATTEMPTS'] ?? '3') ?? 3;

  // JWT
  static String get jwtSecret => dotenv.env['JWT_SECRET'] ?? '';
  static String get jwtExpiry => dotenv.env['JWT_EXPIRY'] ?? '7d';

  // Email
  static String get emailProvider => dotenv.env['EMAIL_PROVIDER'] ?? 'inbucket';
  static String get resendApiKey => dotenv.env['RESEND_API_KEY'] ?? '';
  static String get emailFrom => dotenv.env['EMAIL_FROM'] ?? '';

  // 驗證碼
  static int get verificationCodeLength => int.tryParse(dotenv.env['VERIFICATION_CODE_LENGTH'] ?? '6') ?? 6;
  static int get verificationCodeExpiry => int.tryParse(dotenv.env['VERIFICATION_CODE_EXPIRY'] ?? '300') ?? 300;
  static int get verificationCodeMaxAttempts => int.tryParse(dotenv.env['VERIFICATION_CODE_MAX_ATTEMPTS'] ?? '5') ?? 5;
  static int get verificationCodeResendCooldown => int.tryParse(dotenv.env['VERIFICATION_CODE_RESEND_COOLDOWN'] ?? '60') ?? 60;

  // Session
  static int get sessionExpiry => int.tryParse(dotenv.env['SESSION_EXPIRY'] ?? '604800') ?? 604800;
  static int get maxSessionsPerUser => int.tryParse(dotenv.env['MAX_SESSIONS_PER_USER'] ?? '5') ?? 5;

  // 交易
  static double get maxTransactionAmount => double.tryParse(dotenv.env['MAX_TRANSACTION_AMOUNT'] ?? '1000000.00') ?? 1000000.00;
  static int get transactionsPerPage => int.tryParse(dotenv.env['TRANSACTIONS_PER_PAGE'] ?? '100') ?? 100;

  // 檢查是否為生產環境
  static bool get isProduction => appEnv == 'production';
  static bool get isDevelopment => appEnv == 'development';

  // 驗證必要的環境變數是否存在
  static void validate() {
    final required = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'JWT_SECRET',
      'APP_ENV',
    ];

    final missing = required.where((key) => dotenv.env[key] == null || dotenv.env[key]!.isEmpty).toList();

    if (missing.isNotEmpty) {
      throw Exception('缺少必要的環境變數: ${missing.join(", ")}');
    }

    // 生產環境額外檢查
    if (isProduction) {
      if (supabaseUrl.contains('localhost')) {
        throw Exception('生產環境不能使用 localhost');
      }
      if (emailProvider != 'resend' || resendApiKey.isEmpty) {
        throw Exception('生產環境必須配置 Resend 郵件服務');
      }
    }
  }
}
```

#### 🔄 使用環境變數

在其他檔案中使用：

```dart
import 'package:familyaccounting/config/env_config.dart';
import 'package:dio/dio.dart';

// 創建 Dio 實例
final dio = Dio(
  BaseOptions(
    baseUrl: EnvConfig.supabaseUrl,
    connectTimeout: Duration(milliseconds: EnvConfig.apiTimeout),
    receiveTimeout: Duration(milliseconds: EnvConfig.apiTimeout),
    headers: {
      'apikey': EnvConfig.supabaseAnonKey,
      'Content-Type': 'application/json',
    },
  ),
);

// 檢查環境
if (EnvConfig.isProduction) {
  print('當前為生產環境');
  // 啟用錯誤追蹤等
} else {
  print('當前為開發環境');
  // 啟用 debug 模式
}
```

---

### 4️⃣ 郵件服務切換

#### ❌ 本地開發：Inbucket（測試用）

```env
EMAIL_PROVIDER=inbucket
INBUCKET_URL=http://localhost:54324
```

- 郵件不會真的發送
- 可在 http://localhost:54324 查看測試郵件

#### ✅ 生產環境：Resend（真實發送）

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=noreply@familyaccounting.app
```

#### 📋 設定步驟

1. **註冊 Resend**
   ```bash
   # 前往 https://resend.com
   # 使用 GitHub 帳號註冊
   # 免費方案：每月 3,000 封郵件
   ```

2. **創建 API Key**
   ```bash
   # 登入後前往：API Keys → Create API Key
   # 名稱：familyaccounting-production
   # 權限：Sending access
   # 複製 API Key (以 re_ 開頭)
   # ⚠️ 只顯示一次，請立即保存到 .env.production
   ```

3. **驗證域名（可選但建議）**
   ```bash
   # Resend Dashboard → Domains → Add Domain
   # 輸入域名：familyaccounting.app
   # 按照指示添加 DNS 記錄：
   #   - SPF 記錄
   #   - DKIM 記錄
   #   - DMARC 記錄
   # 等待驗證（通常 5-10 分鐘）
   ```

4. **更新郵件服務代碼**

創建 `lib/services/email_service.dart`：

```dart
import 'package:dio/dio.dart';
import 'package:familyaccounting/config/env_config.dart';

class EmailService {
  final Dio _dio = Dio();

  Future<void> sendVerificationCode(String email, String code) async {
    if (EnvConfig.emailProvider == 'resend') {
      await _sendViaResend(email, code);
    } else {
      await _sendViaInbucket(email, code);
    }
  }

  // 生產環境：使用 Resend
  Future<void> _sendViaResend(String email, String code) async {
    try {
      final response = await _dio.post(
        'https://api.resend.com/emails',
        options: Options(
          headers: {
            'Authorization': 'Bearer ${EnvConfig.resendApiKey}',
            'Content-Type': 'application/json',
          },
        ),
        data: {
          'from': EnvConfig.emailFrom,
          'to': [email],
          'subject': '您的驗證碼',
          'html': '''
            <h2>家庭記帳 APP 驗證碼</h2>
            <p>您的驗證碼是：<strong style="font-size: 24px;">$code</strong></p>
            <p>此驗證碼將在 5 分鐘後過期。</p>
            <p>如果您沒有要求此驗證碼，請忽略此郵件。</p>
          ''',
        },
      );

      if (response.statusCode == 200) {
        print('✓ 郵件已透過 Resend 發送: $email');
      }
    } catch (e) {
      print('✗ 發送郵件失敗: $e');
      rethrow;
    }
  }

  // 開發環境：使用 Inbucket
  Future<void> _sendViaInbucket(String email, String code) async {
    try {
      final response = await _dio.post(
        '${EnvConfig.supabaseUrl.replaceAll('54321', '54324')}/api/v1/messages',
        data: {
          'to': email,
          'subject': '您的驗證碼',
          'body': '您的驗證碼是：$code（此為測試郵件）',
        },
      );

      if (response.statusCode == 200) {
        print('✓ 測試郵件已發送到 Inbucket: $email');
        print('  查看郵件：http://localhost:54324');
      }
    } catch (e) {
      print('✗ 發送測試郵件失敗: $e');
    }
  }
}
```

---

### 5️⃣ API 設定調整

#### 📊 逾時與重試設定

**本地開發**（網路快）：
```env
API_TIMEOUT=10000        # 10 秒
MAX_RETRY_ATTEMPTS=3     # 3 次重試
```

**生產環境**（考慮弱網路）：
```env
API_TIMEOUT=15000        # 15 秒
MAX_RETRY_ATTEMPTS=5     # 5 次重試
```

#### 📝 更新 Dio 配置

創建 `lib/services/api_client.dart`：

```dart
import 'package:dio/dio.dart';
import 'package:familyaccounting/config/env_config.dart';

class ApiClient {
  static Dio createDio() {
    final dio = Dio(
      BaseOptions(
        baseUrl: EnvConfig.supabaseUrl,
        connectTimeout: Duration(milliseconds: EnvConfig.apiTimeout),
        receiveTimeout: Duration(milliseconds: EnvConfig.apiTimeout),
        headers: {
          'apikey': EnvConfig.supabaseAnonKey,
          'Content-Type': 'application/json',
        },
      ),
    );

    // 添加攔截器
    dio.interceptors.add(LogInterceptor(
      requestBody: !EnvConfig.isProduction,  // 生產環境不記錄請求體
      responseBody: !EnvConfig.isProduction, // 生產環境不記錄回應體
    ));

    // 添加重試攔截器
    dio.interceptors.add(
      InterceptorsWrapper(
        onError: (error, handler) async {
          if (_shouldRetry(error)) {
            return handler.resolve(await _retry(dio, error.requestOptions));
          }
          return handler.next(error);
        },
      ),
    );

    return dio;
  }

  static bool _shouldRetry(DioException error) {
    return error.type == DioExceptionType.connectionTimeout ||
           error.type == DioExceptionType.receiveTimeout ||
           error.type == DioExceptionType.sendTimeout ||
           (error.response?.statusCode ?? 0) >= 500;
  }

  static Future<Response> _retry(Dio dio, RequestOptions requestOptions) async {
    final options = Options(
      method: requestOptions.method,
      headers: requestOptions.headers,
    );

    for (var i = 0; i < EnvConfig.maxRetryAttempts; i++) {
      try {
        return await dio.request(
          requestOptions.path,
          data: requestOptions.data,
          queryParameters: requestOptions.queryParameters,
          options: options,
        );
      } catch (e) {
        if (i == EnvConfig.maxRetryAttempts - 1) {
          rethrow;
        }
        await Future.delayed(Duration(seconds: (i + 1) * 2)); // 指數退避
      }
    }

    throw Exception('重試失敗');
  }
}
```

---

### 6️⃣ 應用簽名配置

#### 🍎 iOS 簽名

**需要**：
- Apple Developer Program 帳號（USD $99/年）
- Bundle Identifier（例如：com.familyaccounting.app）

**步驟**：

1. **在 Apple Developer 創建 App ID**
   ```bash
   # 前往 https://developer.apple.com/account
   # Certificates, Identifiers & Profiles → Identifiers
   # 點擊 "+" → App IDs → App
   # Description: Family Accounting App
   # Bundle ID: com.familyaccounting.app (Explicit)
   # Capabilities: 勾選需要的功能
   ```

2. **在 Xcode 中配置**
   ```bash
   cd ~/文件/speckit/familyaccoutting/frontend
   open ios/Runner.xcworkspace

   # 在 Xcode 中：
   # 1. 選擇 Runner → Signing & Capabilities
   # 2. Team: 選擇你的 Apple Developer 帳號
   # 3. Bundle Identifier: com.familyaccounting.app
   # 4. Automatically manage signing: 勾選
   ```

3. **更新 Info.plist**
   ```xml
   <!-- ios/Runner/Info.plist -->
   <key>CFBundleDisplayName</key>
   <string>家庭記帳</string>
   <key>CFBundleIdentifier</key>
   <string>com.familyaccounting.app</string>
   <key>CFBundleVersion</key>
   <string>1</string>
   <key>CFBundleShortVersionString</key>
   <string>1.0.0</string>
   ```

#### 🤖 Android 簽名

**步驟**：

1. **創建 Keystore**
   ```bash
   cd ~/文件/speckit/familyaccoutting

   keytool -genkey -v -keystore release-keystore.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias familyaccounting

   # 輸入資訊：
   # Keystore password: [設定強密碼]
   # Key password: [設定強密碼，可與 keystore 密碼相同]
   # 名字與姓氏: Family Accounting
   # 組織單位: Development
   # 組織: Family Accounting
   # 城市: Taipei
   # 州省: Taiwan
   # 國家代碼: TW
   ```

2. **創建 key.properties**
   ```bash
   cd ~/文件/speckit/familyaccoutting/frontend/android
   nano key.properties
   ```

   內容：
   ```properties
   storePassword=your-keystore-password
   keyPassword=your-key-password
   keyAlias=familyaccounting
   storeFile=../../release-keystore.jks
   ```

   ⚠️ **重要**：將 `key.properties` 加入 `.gitignore`

3. **更新 build.gradle**

   編輯 `android/app/build.gradle`：

   ```gradle
   // 在 android {} 區塊之前添加
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
       // ... 其他配置

       signingConfigs {
           release {
               keyAlias keystoreProperties['keyAlias']
               keyPassword keystoreProperties['keyPassword']
               storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
               storePassword keystoreProperties['storePassword']
           }
       }

       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               shrinkResources true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

4. **更新應用資訊**

   編輯 `android/app/build.gradle`：

   ```gradle
   android {
       defaultConfig {
           applicationId "com.familyaccounting.app"
           minSdkVersion 21
           targetSdkVersion 34
           versionCode 1
           versionName "1.0.0"
       }
   }
   ```

---

### 7️⃣ 安全設定

#### 🔒 Row Level Security (RLS)

生產環境**必須**啟用 RLS 來保護使用者資料。

創建 `backend/supabase/migrations/005_enable_rls.sql`：

```sql
-- ==========================================
-- 啟用 Row Level Security
-- ==========================================

-- 1. users 表
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 使用者只能查看自己的資料
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 使用者只能更新自己的資料
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 2. sessions 表
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- 3. transactions 表
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- 4. verification_codes 表
-- 由於驗證碼是公開註冊使用，需要特殊處理
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- 允許插入驗證碼（註冊時）
CREATE POLICY "Anyone can create verification codes"
  ON verification_codes FOR INSERT
  WITH CHECK (true);

-- 只允許查詢最近 10 分鐘的驗證碼
CREATE POLICY "View recent verification codes"
  ON verification_codes FOR SELECT
  USING (created_at > NOW() - INTERVAL '10 minutes');
```

推送到生產環境：

```bash
cd ~/文件/speckit/familyaccoutting/backend
supabase db push
```

#### 🛡️ API Rate Limiting

在 Supabase Dashboard 中配置：

```bash
# Settings → API → Rate Limiting
# 建議設定：
# - Anonymous requests: 30/min
# - Authenticated requests: 100/min
```

---

### 8️⃣ 錯誤追蹤與監控

#### 🐛 整合 Sentry (建議)

1. **註冊 Sentry**
   ```bash
   # 前往 https://sentry.io
   # 創建專案：Flutter
   # 複製 DSN
   ```

2. **安裝套件**
   ```bash
   cd ~/文件/speckit/familyaccoutting/frontend
   flutter pub add sentry_flutter
   ```

3. **更新 main.dart**
   ```dart
   import 'package:sentry_flutter/sentry_flutter.dart';

   Future<void> main() async {
     await SentryFlutter.init(
       (options) {
         options.dsn = 'https://xxxxx@xxxxx.ingest.sentry.io/xxxxx';
         options.environment = EnvConfig.appEnv;
         options.release = EnvConfig.appVersion;
         // 只在生產環境啟用
         options.enabled = EnvConfig.isProduction;
       },
       appRunner: () => runApp(const ProviderScope(child: MyApp())),
     );
   }
   ```

---

### 9️⃣ 建置配置

#### 📱 Flutter Build 指令差異

**開發/測試建置**：
```bash
flutter run                        # Debug 模式
flutter run --release              # Release 模式（仍使用 .env）
```

**生產建置**：
```bash
# Android
flutter build appbundle --release  # 自動載入 .env.production
flutter build apk --release        # 自動載入 .env.production

# iOS
flutter build ios --release        # 自動載入 .env.production
```

#### 🔍 驗證建置使用正確的環境變數

添加到 `lib/main.dart`：

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 載入環境變數
  final envFile = kReleaseMode ? '../.env.production' : '../.env';
  await dotenv.load(fileName: envFile);

  // 驗證環境
  EnvConfig.validate();

  // 顯示當前環境（只在首次啟動時）
  if (kDebugMode || !kReleaseMode) {
    print('=====================================');
    print('環境: ${EnvConfig.appEnv}');
    print('Supabase URL: ${EnvConfig.supabaseUrl}');
    print('郵件服務: ${EnvConfig.emailProvider}');
    print('=====================================');
  }

  // 如果是生產環境但使用 localhost，停止應用
  if (kReleaseMode && EnvConfig.supabaseUrl.contains('localhost')) {
    throw Exception('錯誤：生產建置不能使用 localhost');
  }

  runApp(const ProviderScope(child: MyApp()));
}
```

---

### 🔟 部署前檢查清單

#### ✅ 環境配置

- [ ] 已創建 Supabase 雲端專案
- [ ] 已創建 `.env.production` 並填入正確的值
- [ ] 已生成強隨機的 `JWT_SECRET`（使用 `openssl rand -base64 32`）
- [ ] 已將 `APP_ENV` 設為 `production`
- [ ] 已更新 `SUPABASE_URL` 為雲端 URL（https://xxxxx.supabase.co）
- [ ] 已更新 `SUPABASE_ANON_KEY` 和 `SUPABASE_SERVICE_ROLE_KEY`
- [ ] 已確認 `.env.production` 在 `.gitignore` 中

#### ✅ 資料庫

- [ ] 已推送所有遷移到雲端（`supabase db push`）
- [ ] 已驗證遷移成功（`supabase db diff` 顯示無差異）
- [ ] 已啟用 Row Level Security（RLS）
- [ ] 已測試 RLS 政策是否正常運作
- [ ] 已配置自動備份策略

#### ✅ 郵件服務

- [ ] 已註冊 Resend 帳號
- [ ] 已獲取 Resend API Key
- [ ] 已將 `EMAIL_PROVIDER` 改為 `resend`
- [ ] 已設定 `RESEND_API_KEY` 和 `EMAIL_FROM`
- [ ] 已驗證域名（可選但建議）
- [ ] 已測試郵件發送功能

#### ✅ Flutter 應用

- [ ] 已安裝 `flutter_dotenv` 套件
- [ ] 已在 `pubspec.yaml` 中添加 `.env` 和 `.env.production` 到 assets
- [ ] 已修改 `main.dart` 載入環境變數
- [ ] 已創建 `EnvConfig` 類別
- [ ] 已實作環境變數驗證邏輯
- [ ] 已更新所有使用硬編碼值的地方為 `EnvConfig`
- [ ] 已測試 Release 模式使用 `.env.production`

#### ✅ 應用簽名

**iOS**：
- [ ] 已註冊 Apple Developer Program
- [ ] 已創建 App ID
- [ ] 已配置 Provisioning Profile
- [ ] 已在 Xcode 中設定 Team 和 Bundle Identifier
- [ ] 已更新 Info.plist

**Android**：
- [ ] 已創建 release keystore (.jks)
- [ ] 已創建 `key.properties` 並填入正確值
- [ ] 已將 `key.properties` 加入 `.gitignore`
- [ ] 已更新 `build.gradle` 配置簽名
- [ ] 已備份 keystore（非常重要！）

#### ✅ 安全設定

- [ ] 已啟用所有表格的 RLS
- [ ] 已測試 RLS 政策
- [ ] 已配置 API Rate Limiting
- [ ] 已確保敏感資料不在程式碼中
- [ ] 已檢查所有環境變數都從 `.env` 讀取
- [ ] 已移除所有 debug 日誌（生產環境）

#### ✅ 錯誤追蹤

- [ ] 已整合 Sentry 或其他錯誤追蹤服務（建議）
- [ ] 已測試錯誤上報功能
- [ ] 已配置告警通知

#### ✅ 測試

- [ ] 已在 Release 模式下測試應用
- [ ] 已測試所有 API 呼叫
- [ ] 已測試郵件發送
- [ ] 已測試註冊/登入流程
- [ ] 已測試交易記錄功能
- [ ] 已測試錯誤情境（網路斷線、無效輸入等）

#### ✅ 商店準備

**iOS**：
- [ ] 已在 App Store Connect 創建應用
- [ ] 已準備應用截圖（所有尺寸）
- [ ] 已準備應用圖示（1024x1024）
- [ ] 已填寫應用描述和關鍵字
- [ ] 已填寫隱私政策 URL
- [ ] 已準備審核資訊

**Android**：
- [ ] 已在 Google Play Console 創建應用
- [ ] 已準備應用截圖
- [ ] 已準備應用圖示
- [ ] 已填寫應用描述
- [ ] 已填寫內容分級問卷
- [ ] 已填寫隱私政策 URL

#### ✅ 監控與維護

- [ ] 已設定 Supabase 使用量告警
- [ ] 已設定錯誤告警通知
- [ ] 已規劃備份策略
- [ ] 已準備更新與回滾計畫
- [ ] 已文件化所有配置與密碼（安全保存）

---

### 📚 相關章節

完成以上調整後，請參閱：
- [上線部署步驟](#上線部署步驟) - 詳細的部署指南
- [監控與維護](#階段-6-監控與維護) - 上線後的維護工作

---

## 上線部署步驟

### 階段 1: Supabase 雲端設定

#### 1.1 創建 Supabase 專案

```bash
# 步驟：
1. 前往 https://supabase.com
2. 登入或註冊帳號（建議使用 GitHub）
3. 點擊 "New Project"
4. 填寫資訊：
   - Organization: 選擇或創建組織
   - Name: familyaccounting
   - Database Password: 設定強密碼（請記住！）
   - Region: Singapore (最接近台灣)
   - Pricing: Free（或根據需求選擇）
5. 點擊 "Create new project"
6. 等待約 2 分鐘初始化完成
```

#### 1.2 獲取生產環境金鑰

```bash
# 步驟：
1. 進入專案 Dashboard
2. 左側選單 → Settings → API
3. 複製以下資訊：
   - Project URL (例如: https://xxxxx.supabase.co)
   - Project API keys:
     * anon public (例如: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
     * service_role (例如: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
4. 記錄 Project ID (在 Settings → General)
```

#### 1.3 部署資料庫結構

```bash
# 1. 連結本地專案到雲端
cd ~/文件/speckit/familyaccoutting/backend
supabase link --project-ref <your-project-id>
# 輸入資料庫密碼

# 2. 推送所有遷移到雲端
supabase db push

# 3. 驗證遷移成功
supabase db diff
# 應該顯示 "No schema changes found"
```

### 階段 2: 環境變數配置

#### 2.1 創建生產環境配置

```bash
# 創建 .env.production
cd ~/文件/speckit/familyaccoutting
cp .env.example .env.production
```

#### 2.2 生成安全的 JWT Secret

```bash
# 生成強隨機密鑰
openssl rand -base64 32

# 輸出範例：
# K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

#### 2.3 編輯 .env.production

```env
# Supabase 設定（從 Supabase Dashboard 取得）
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email 發送服務
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=noreply@familyaccounting.app

# JWT 設定（使用生成的強隨機值）
JWT_SECRET=K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
JWT_EXPIRY=7d

# 應用程式設定
APP_ENV=production
APP_NAME=家庭記帳APP
APP_VERSION=1.0.0

# 資料庫設定
DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### 階段 3: 郵件服務設定

#### 3.1 註冊 Resend

```bash
# 步驟：
1. 前往 https://resend.com
2. 註冊帳號（可使用 GitHub）
3. 免費方案：每月 3,000 封郵件（足夠初期使用）
```

#### 3.2 獲取 API Key

```bash
# 步驟：
1. 登入 Resend Dashboard
2. 左側選單 → API Keys
3. 點擊 "Create API Key"
4. 名稱：familyaccounting-production
5. 權限：選擇 "Sending access"
6. 點擊 "Create"
7. 複製 API Key (以 re_ 開頭)
   - 注意：只會顯示一次，請妥善保存
8. 填入 .env.production 的 RESEND_API_KEY
```

#### 3.3 驗證域名（可選）

```bash
# 如果有自己的域名：
1. Resend Dashboard → Domains
2. 點擊 "Add Domain"
3. 輸入域名（例如：familyaccounting.app）
4. 按照指示添加 DNS 記錄
5. 等待驗證完成
6. 更新 .env.production 的 EMAIL_FROM
```

### 階段 4: Flutter 應用配置

#### 4.1 安裝環境變數套件

```bash
cd ~/文件/speckit/familyaccoutting/frontend
flutter pub add flutter_dotenv
flutter pub add flutter_dotenv --dev
```

#### 4.2 配置 pubspec.yaml

```yaml
# 在 pubspec.yaml 中添加：
flutter:
  assets:
    - .env                # 開發環境
    - .env.production     # 生產環境
```

#### 4.3 更新應用程式碼

```dart
// lib/main.dart
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 根據建置模式載入不同的環境變數
  final envFile = kReleaseMode ? '.env.production' : '.env';
  await dotenv.load(fileName: envFile);

  runApp(const MyApp());
}

// 使用環境變數
final supabaseUrl = dotenv.env['SUPABASE_URL']!;
final supabaseAnonKey = dotenv.env['SUPABASE_ANON_KEY']!;
```

### 階段 5: 建置與部署

#### 5.1 iOS 部署

```bash
cd ~/文件/speckit/familyaccoutting/frontend

# 1. 清理舊的建置
flutter clean
flutter pub get

# 2. 建置 iOS Release
flutter build ios --release

# 3. 在 Xcode 中打開
open ios/Runner.xcworkspace

# 4. 在 Xcode 中：
#    a. 選擇 "Any iOS Device (arm64)"
#    b. Product → Archive
#    c. 等待 Archive 完成
#    d. 在 Organizer 中點擊 "Distribute App"
#    e. 選擇 "App Store Connect"
#    f. 按照步驟上傳

# 5. 在 App Store Connect 中：
#    - 填寫應用資訊
#    - 上傳截圖
#    - 提交審核
```

**iOS 部署前置作業**：
- 需要 Apple Developer Program 帳號（USD $99/年）
- 需要在 Apple Developer 創建 App ID
- 需要配置 Provisioning Profile
- 需要在 App Store Connect 創建應用

#### 5.2 Android 部署

```bash
cd ~/文件/speckit/familyaccoutting/frontend

# 1. 清理舊的建置
flutter clean
flutter pub get

# 2. 建置 Android App Bundle (推薦)
flutter build appbundle --release

# 產出位置：
# build/app/outputs/bundle/release/app-release.aab

# 或建置 APK
flutter build apk --release

# 產出位置：
# build/app/outputs/flutter-apk/app-release.apk

# 3. 上傳到 Google Play Console：
#    - 前往 https://play.google.com/console
#    - 選擇應用（或創建新應用）
#    - 發布 → 正式版
#    - 上傳 app-release.aab
#    - 填寫版本資訊
#    - 提交審核
```

**Android 部署前置作業**：
- 需要 Google Play Developer 帳號（一次性 USD $25）
- 需要配置 App Signing Key
- 需要在 Google Play Console 創建應用

#### 5.3 簽名配置

**Android 簽名**：

```bash
# 1. 創建 keystore
keytool -genkey -v -keystore ~/familyaccounting.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias familyaccounting

# 2. 創建 key.properties
cd ~/文件/speckit/familyaccoutting/frontend/android
nano key.properties

# 內容：
storePassword=<your-keystore-password>
keyPassword=<your-key-password>
keyAlias=familyaccounting
storeFile=~/familyaccounting.keystore

# 3. 更新 build.gradle（已配置則跳過）
# 確保 android/app/build.gradle 中有正確的簽名配置
```

### 階段 6: 監控與維護

#### 6.1 Supabase 監控

```bash
# 在 Supabase Dashboard:
1. 前往 Settings → Database
2. 啟用 Connection Pooling（建議）
3. 設定 Auto-pause（可選，節省成本）

# 監控使用量：
1. Dashboard 首頁顯示：
   - Database size
   - API requests
   - Storage usage
   - Bandwidth
2. 設定告警（接近配額時通知）
```

#### 6.2 日誌與除錯

```bash
# Supabase 日誌
1. Dashboard → Logs → API
2. 查看 API 請求日誌

# Flutter 錯誤追蹤
建議整合：
- Sentry: https://sentry.io
- Firebase Crashlytics
```

#### 6.3 備份策略

```bash
# Supabase 自動備份（Pro 方案）
# 免費方案：手動備份

# 手動備份資料庫
supabase db dump -f backup.sql

# 或使用 pg_dump
pg_dump "postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres" \
  > backup_$(date +%Y%m%d).sql
```

### 部署檢查清單

上線前請確認：

- [ ] 已在 Supabase 創建雲端專案
- [ ] 已推送所有資料庫遷移到雲端
- [ ] 已創建 .env.production 並填入正確值
- [ ] 已生成強隨機的 JWT_SECRET
- [ ] 已設定 Resend 郵件服務
- [ ] 已配置 Flutter 環境變數載入
- [ ] 已將 APP_ENV 設為 production
- [ ] 已確保 .env.production 在 .gitignore 中
- [ ] 已測試生產環境 API 連接
- [ ] 已配置應用簽名（iOS/Android）
- [ ] 已建置 Release 版本
- [ ] 已在商店創建應用列表
- [ ] 已準備應用截圖與描述
- [ ] 已設定監控與告警
- [ ] 已規劃備份策略
- [ ] 已準備更新與回滾計畫

---

## 重要連結

### 本地開發

| 服務 | URL | 用途 |
|------|-----|------|
| **Supabase Studio** | http://127.0.0.1:54323 | 資料庫管理介面 |
| **Mailpit** | http://127.0.0.1:54324 | 測試郵件查看器 |
| **API Gateway** | http://127.0.0.1:54321 | REST API 端點 |
| **GraphQL** | http://127.0.0.1:54321/graphql/v1 | GraphQL 端點 |
| **Storage** | http://127.0.0.1:54321/storage/v1/s3 | S3 Storage API |
| **Analytics** | http://127.0.0.1:54327 | 分析 Dashboard |

### 文檔與資源

| 資源 | URL | 說明 |
|------|-----|------|
| **Flutter 官方文檔** | https://docs.flutter.dev | Flutter 開發文檔 |
| **Supabase 文檔** | https://supabase.com/docs | Supabase 官方文檔 |
| **Riverpod 文檔** | https://riverpod.dev | Riverpod 狀態管理 |
| **Dio 文檔** | https://pub.dev/packages/dio | HTTP 客戶端文檔 |
| **Freezed 文檔** | https://pub.dev/packages/freezed | 代碼生成文檔 |

### 線上服務

| 服務 | URL | 說明 |
|------|-----|------|
| **Supabase Dashboard** | https://app.supabase.com | 雲端專案管理 |
| **Resend Dashboard** | https://resend.com/overview | 郵件服務管理 |
| **GitHub** | https://github.com | 版本控制 |
| **App Store Connect** | https://appstoreconnect.apple.com | iOS 應用管理 |
| **Google Play Console** | https://play.google.com/console | Android 應用管理 |

---

## 常見問題

### Q1: 如何重啟 Supabase 本地環境？

```bash
cd ~/文件/speckit/familyaccoutting/backend
supabase stop
supabase start
```

### Q2: Docker 容器占用太多空間怎麼辦？

```bash
# 查看 Docker 磁碟使用
docker system df

# 清理未使用的資源
docker system prune

# 清理 Volume（注意：會刪除資料）
docker volume prune

# 只清理特定專案的 Volume
docker volume ls --filter label=com.supabase.cli.project=familyaccounting-local
docker volume rm <volume_name>
```

### Q3: Flutter 套件版本衝突怎麼解決？

```bash
# 方法 1: 升級所有套件
flutter pub upgrade --major-versions

# 方法 2: 清理並重新安裝
flutter clean
flutter pub get

# 方法 3: 手動調整 pubspec.yaml 中的版本約束
```

### Q4: 如何查看 Supabase 容器日誌？

```bash
# 查看所有容器
docker ps --filter "name=familyaccounting"

# 查看特定容器日誌
docker logs supabase_db_familyaccounting-local

# 實時查看日誌
docker logs -f supabase_db_familyaccounting-local
```

### Q5: 忘記 .env 檔案在哪裡？

**.env 檔案位置**：`/Users/chunchun/文件/speckit/familyaccoutting/.env`

```bash
# 查看檔案
cat ~/文件/speckit/familyaccoutting/.env

# 編輯檔案
nano ~/文件/speckit/familyaccoutting/.env
```

### Q6: 如何在 Finder 中顯示 .env 隱藏檔案？

```bash
# 方法 1: 使用快捷鍵
在 Finder 中按 Command + Shift + .

# 方法 2: 使用終端機開啟
open ~/文件/speckit/familyaccoutting
# 然後在 Finder 中按 Command + Shift + .
```

### Q7: 本地資料庫如何備份？

```bash
cd ~/文件/speckit/familyaccoutting/backend

# 方法 1: 使用 Supabase CLI
supabase db dump -f backup.sql

# 方法 2: 使用 pg_dump
pg_dump "postgresql://postgres:postgres@localhost:54322/postgres" \
  > backup_$(date +%Y%m%d).sql

# 恢復備份
psql "postgresql://postgres:postgres@localhost:54322/postgres" \
  < backup.sql
```

### Q8: 如何切換不同的 Supabase 專案？

```bash
# 停止當前專案
cd ~/文件/speckit/familyaccoutting/backend
supabase stop

# 啟動另一個專案
cd ~/文件/project/family-accounting-app
supabase start

# 注意：同一時間只能運行一個 Supabase 本地實例
# 因為它們使用相同的端口（54321, 54322 等）
```

### Q9: Flutter 程式碼生成失敗怎麼辦？

```bash
# 清理並重新生成
flutter clean
flutter pub get
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs

# 如果還是失敗，檢查：
# 1. 是否有語法錯誤
# 2. 是否所有註解都正確
# 3. 是否有檔案路徑問題
```

### Q10: 如何測試郵件發送？

**本地環境**：
1. 確保 Supabase 正在運行
2. 開啟 Mailpit：http://localhost:54324
3. 應用程式發送郵件
4. 在 Mailpit 中查看收到的郵件

**測試程式碼範例**：
```dart
// 使用 Dio 發送測試郵件到 Inbucket
final response = await dio.post(
  'http://localhost:54324/api/v1/messages',
  data: {
    'to': 'test@example.com',
    'subject': '測試郵件',
    'body': '這是一封測試郵件',
  },
);
```

---

## 附錄

### A. 開發工具推薦

#### IDE 與編輯器
- **VS Code** + Flutter Extension
- **Android Studio** + Flutter Plugin
- **Xcode** (iOS 開發必需)

#### VS Code 推薦擴充套件
```
- Flutter
- Dart
- GitLens
- Docker
- PostgreSQL
- Thunder Client (API 測試)
- Error Lens
- Bracket Pair Colorizer
```

#### Chrome 擴充套件
```
- Supabase DevTools
- React DevTools (如果使用 Web)
- Redux DevTools
```

### B. 效能最佳化建議

#### Flutter 應用
1. 使用 `const` 建構子
2. 避免不必要的 rebuild
3. 使用 `ListView.builder` 而非 `ListView`
4. 圖片使用 `CachedNetworkImage`
5. 啟用 Tree-shaking

#### Supabase 資料庫
1. 適當使用索引
2. 啟用 Connection Pooling
3. 使用 Row Level Security
4. 批次操作而非單一請求
5. 啟用 Query Cache

### C. 安全最佳實踐

1. **永遠不要將 .env 提交到 Git**
2. **使用 HTTPS (生產環境)**
3. **啟用 Row Level Security**
4. **定期更新依賴套件**
5. **使用強密碼與 2FA**
6. **定期備份資料庫**
7. **監控異常 API 請求**
8. **限制 API Rate Limiting**

### D. Git 分支策略

建議使用 Git Flow：

```
main (生產環境)
  └── develop (開發環境)
       ├── feature/user-auth (功能分支)
       ├── feature/transaction-list
       └── bugfix/login-issue (修復分支)
```

### E. 版本號規範

使用 Semantic Versioning (語義化版本)：

```
格式：MAJOR.MINOR.PATCH (例如：1.0.0)

MAJOR: 重大變更（不向後兼容）
MINOR: 新增功能（向後兼容）
PATCH: Bug 修復（向後兼容）

範例：
1.0.0 - 初始發布
1.0.1 - 修復登入 Bug
1.1.0 - 新增交易統計功能
2.0.0 - 重構整個應用架構
```

---

## 結論

### 當前狀態

✅ **已完成**：
- 開發環境完整配置（Flutter, Deno, Supabase CLI, Docker）
- Flutter 前端專案初始化（133 個套件）
- Supabase 後端啟動（12 個服務容器）
- 4 個資料庫遷移已套用
- 環境變數正確配置
- 本地開發環境完全可用

### 下一步建議

1. **開發階段**：
   - 實作使用者註冊/登入 UI
   - 實作 Riverpod 狀態管理
   - 實作 API Service 層
   - 撰寫單元測試

2. **測試階段**：
   - 本地測試所有功能
   - 整合測試
   - 效能測試
   - 使用者體驗測試

3. **準備上線**：
   - 創建 Supabase 雲端專案
   - 配置生產環境變數
   - 建置 Release 版本
   - 提交應用商店審核

### 技術支援

如遇到問題，請參考：
1. 本報告的「常見問題」章節
2. 專案中的 README.md 和 SETUP.md
3. 各套件的官方文檔
4. 開發社群（Stack Overflow, GitHub Issues）

---

## 報告資訊

- **生成日期**：2025-11-10
- **專案版本**：1.0.0
- **報告版本**：1.0
- **最後更新**：2025-11-10 14:30

---

**© 2025 家庭記帳 APP 開發團隊**
