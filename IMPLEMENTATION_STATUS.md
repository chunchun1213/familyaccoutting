# 實作進度報告

**功能分支**: `001-member-accounting`  
**日期**: 2025-11-06  
**狀態**: 專案設定階段

## 當前狀態

由於開發環境尚未完整設定(Flutter SDK、Deno、Supabase CLI 未安裝),已完成基礎專案結構建立和配置文件準備。

## 已完成任務

### Phase 1: 專案設定 (部分完成)

- [x] **T001**: 建立專案根目錄結構 (backend/, frontend/)
- [x] **T006**: 建立環境變數範本檔案 (.env.example)
- [x] **基礎設定文件**:
  - README.md - 專案說明文件
  - SETUP.md - 環境設定指南
  - .gitignore - Git 忽略清單
  - frontend/pubspec.yaml - Flutter 相依套件定義
  - frontend/analysis_options.yaml - Dart 程式碼檢查規則

### Phase 2: 基礎建設 (資料庫遷移)

- [x] **T008**: 建立資料庫遷移腳本 001_create_users.sql
- [x] **T009**: 建立資料庫遷移腳本 002_create_verification_codes.sql
- [x] **T010**: 建立資料庫遷移腳本 003_create_sessions.sql
- [x] **T011**: 建立資料庫遷移腳本 004_create_transactions.sql

## 專案結構

```text
familyaccoutting/
├── backend/
│   └── supabase/
│       ├── config.toml                    # Supabase 設定
│       ├── functions/                     # Edge Functions (待實作)
│       │   ├── auth/
│       │   ├── accounting/
│       │   └── _shared/
│       ├── migrations/                    # 資料庫遷移 ✓
│       │   ├── 001_create_users.sql
│       │   ├── 002_create_verification_codes.sql
│       │   ├── 003_create_sessions.sql
│       │   └── 004_create_transactions.sql
│       ├── seed/                          # 測試資料 (待實作)
│       └── tests/                         # 後端測試 (待實作)
├── frontend/
│   ├── pubspec.yaml                       # Flutter 相依套件 ✓
│   ├── analysis_options.yaml              # 程式碼檢查規則 ✓
│   └── lib/                               # 前端程式碼 (待實作)
├── specs/
│   └── 001-member-accounting/             # 功能規格文件 ✓
├── .env.example                           # 環境變數範本 ✓
├── .gitignore                             # Git 忽略清單 ✓
├── README.md                              # 專案說明 ✓
└── SETUP.md                               # 環境設定指南 ✓
```

## 環境需求 (待安裝)

實作需要以下開發工具,請參閱 [SETUP.md](./SETUP.md) 完成安裝:

1. **Flutter SDK** 3.16.0+
2. **Dart SDK** 3.2.0+ (Flutter 自帶)
3. **Deno** 1.40.0+
4. **Supabase CLI** 1.127.0+
5. **Docker Desktop** (用於本地 Supabase 環境)
6. **Git** 2.30.0+

## 下一步行動

### 1. 設定開發環境

請按照 [SETUP.md](./SETUP.md) 完成以下安裝:

```bash
# 1. 安裝 Flutter SDK
# 參見 SETUP.md 的詳細步驟

# 2. 安裝 Deno
curl -fsSL https://deno.land/install.sh | sh

# 3. 安裝 Supabase CLI
brew install supabase/tap/supabase

# 4. 安裝 Docker Desktop
# 從官網下載安裝
```

### 2. 初始化專案

環境設定完成後,執行:

```bash
# 初始化 Flutter 專案
cd frontend
flutter create . --org com.familyaccounting --platforms ios,android
flutter pub get

# 初始化 Supabase
cd ../backend
supabase init
supabase start

# 套用資料庫遷移
supabase db reset
```

### 3. 繼續實作

環境準備就緒後,重新執行:

```bash
/speckit.implement
```

系統將從 Phase 1: T002 繼續執行剩餘任務。

## 已建立的資料庫遷移

### 1. Users Table (使用者資料表)

- 使用者 ID、姓名、Email、密碼(bcrypt 雜湊)
- Email 驗證狀態追蹤
- Row Level Security (RLS) 保護
- 自動更新 updated_at 時間戳

### 2. Verification Codes Table (驗證碼資料表)

- 6 位數驗證碼
- 5 分鐘有效期限(自動設定)
- 5 次錯誤鎖定機制
- 60 秒重發冷卻時間
- 自動清理過期記錄(24 小時後)

### 3. Sessions Table (會話資料表)

- JWT Token 雜湊儲存
- 7 天有效期限(自動設定)
- 單一使用者最多 5 個有效會話(自動清理最舊)
- 追蹤裝置資訊和最後使用時間
- RLS 保護

### 4. Transactions Table (交易記錄資料表)

- 收入/支出類型
- 類別、金額(精度小數點後 2 位)、備註
- 金額上限 1,000,000
- 離線同步支援(synced_at)
- RLS 保護(使用者只能存取自己的記錄)

## 參考文件

- [功能規格](./specs/001-member-accounting/spec.md)
- [實作計畫](./specs/001-member-accounting/plan.md)
- [任務清單](./specs/001-member-accounting/tasks.md)
- [資料模型](./specs/001-member-accounting/data-model.md)
- [快速開始指南](./specs/001-member-accounting/quickstart.md)
- [環境設定指南](./SETUP.md)

## 技術決策

已根據 research.md 確認以下技術選型:

- **前端框架**: Flutter 3.16+ (跨平台、高效能)
- **狀態管理**: Riverpod 2.4.0+ (編譯期安全、易測試)
- **HTTP 客戶端**: Dio 5.4.0+ (攔截器、錯誤處理)
- **本地儲存**: flutter_secure_storage 9.0.0+ (平台原生加密)
- **後端服務**: Supabase (BaaS、PostgreSQL、Edge Functions)
- **API 框架**: Hono (輕量級、TypeScript)
- **Email 服務**: Resend (開發者友善、高送達率)

## 注意事項

1. **環境變數**: 正式部署前請更新 .env.example 中的 TODO 項目
2. **JWT Secret**: 正式環境使用 `openssl rand -base64 32` 產生強隨機密鑰
3. **Supabase URL**: 部署時從 Supabase Project Settings > API 取得實際 URL
4. **Email 服務**: 正式環境改用 Resend,需申請 API Key

## 聯絡資訊

如遇問題,請參閱:
- 快速開始指南: [quickstart.md](./specs/001-member-accounting/quickstart.md)
- 環境設定指南: [SETUP.md](./SETUP.md)
