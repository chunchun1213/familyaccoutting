# 實作計畫:會員註冊與登入系統以及記帳主頁功能

**分支**: `001-member-accounting` | **日期**: 2025-11-05 | **規格**: [spec.md](./spec.md)  
**輸入**: 功能規格來自 `/specs/001-member-accounting/spec.md`

**說明**: 此計畫由 `/speckit.plan` 指令產生。請參閱 `.specify/templates/commands/plan.md` 了解執行工作流程。

## 摘要

本功能實作家庭記帳應用程式的核心會員系統和記帳主頁。包含 Email 驗證的使用者註冊、密碼登入、自動登入(7 天會話)、以及記帳主頁的財務概覽、新增收支記錄、交易記錄列表等功能。技術架構採用 Flutter 前端搭配 Supabase 後端,使用 Email API 發送驗證碼,本地儲存使用 flutter_secure_storage 支援離線暫存。

## 技術環境

**前端技術棧**:
- **語言/版本**: Flutter SDK 3.16+, Dart 3.2+
- **主要相依套件**: 
  - flutter_riverpod ^2.4.0 (狀態管理)
  - Material 3 (UI 元件)
  - flutter_form_builder ^9.1.0 (表單驗證)
  - flutter_secure_storage ^9.0.0 (本地加密儲存)
  - dio ^5.4.0 (HTTP 客戶端)
- **測試框架**: flutter_test (單元測試), integration_test (整合測試)
- **目標平台**: iOS 13+, Android 8.0+ (API 26+)

**後端技術棧**:
- **認證服務**: Supabase Auth
- **API 框架**: Supabase Edge Functions (Deno runtime) + Hono Server
- **資料庫**: Supabase PostgreSQL
- **快取儲存**: Supabase KV Store (Deno KV)
- **Email 服務**: Resend Email API
- **測試框架**: Deno.test (單元測試), Supertest (API 整合測試)

**效能目標**: 
- 註冊 API < 500ms (p95)
- 登入 API < 300ms (p95)
- Email 驗證碼發送 < 30 秒
- 主頁載入 < 2 秒
- 新增記錄 API < 400ms (p95)
- 交易列表查詢 < 500ms (p95)

**限制條件**: 
- 單筆金額上限 1,000,000.00
- 會話有效期限 7 天
- 本地暫存資料保留 7 天
- 交易列表單次最多 100 筆(分頁)
- 最多 5 個裝置同時登入

**規模/範圍**: 
- 預估 10,000 位使用者
- 每月預估 100,000 筆交易記錄
- 4 個主要實體(User, VerificationCode, Transaction, Session)
- 5 個使用者故事(2 個 P1, 2 個 P2, 1 個 P3)
- 40 個功能需求

## Constitution 檢核

*關卡:必須在 Phase 0 研究前通過。Phase 1 設計後重新檢核。*

**必要驗證** (基於 `.specify/memory/constitution.md`):

- [x] **程式碼品質**: 計畫包含 linting/formatting 設定(Flutter: flutter_lints, dart format; Deno: deno fmt, deno lint),文件標準(Dart docstrings, JSDoc)
- [x] **測試標準**: TDD 工作流程已定義,測試類型已指定(單元測試/整合測試/契約測試)
- [x] **使用者體驗**: 無障礙需求已註記(WCAG 2.1 AA, Semantics),錯誤處理模式已定義(繁體中文錯誤訊息,即時驗證)
- [x] **效能**: 效能目標已識別,此功能的基準已定義(見上方效能目標)
- [x] **文件語言**: 此計畫及所有使用者文件使用繁體中文(zh-TW)撰寫
- [x] **品質關卡**: 所有 6 個關卡(規格 → 測試 → 實作 → 效能 → UX → 文件)已確認

**此功能的效能目標**:
- API 端點: 註冊 <500ms, 登入 <300ms, 新增記錄 <400ms, 查詢列表 <500ms (p95)
- UI 互動: 表單驗證 <100ms, 頁面切換 <200ms, 列表滾動 60fps
- 資料庫查詢: 使用者查詢 <50ms, 交易列表查詢 <100ms (p95)

**語言合規性**:
- [x] plan.md 使用繁體中文撰寫
- [x] spec.md 使用繁體中文撰寫
- [x] tasks.md 將使用繁體中文撰寫
- [x] 使用者文件將使用繁體中文

**需要理由的違規項目**: 無

## 專案結構

## 專案結構

### 文件(此功能)

```text
specs/001-member-accounting/
├── spec.md              # 功能規格(/speckit.specify 指令輸出)
├── plan.md              # 此檔案(/speckit.plan 指令輸出)
├── research.md          # Phase 0 輸出(/speckit.plan 指令)
├── data-model.md        # Phase 1 輸出(/speckit.plan 指令)
├── quickstart.md        # Phase 1 輸出(/speckit.plan 指令)
├── contracts/           # Phase 1 輸出(/speckit.plan 指令)
│   ├── api-auth.yaml   # 認證 API OpenAPI 規格
│   └── api-accounting.yaml  # 記帳 API OpenAPI 規格
├── checklists/          # 品質檢核清單
│   └── requirements.md  # 需求檢核清單
└── tasks.md             # Phase 2 輸出(/speckit.tasks 指令 - 非由 /speckit.plan 建立)
```

### 原始碼(專案根目錄)

此專案採用 Mobile + API 架構:

```text
backend/
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── auth/           # 認證相關函式
│   │   │   ├── register.ts
│   │   │   ├── verify-email.ts
│   │   │   ├── login.ts
│   │   │   └── logout.ts
│   │   ├── accounting/     # 記帳相關函式
│   │   │   ├── get-transactions.ts
│   │   │   ├── create-transaction.ts
│   │   │   └── get-summary.ts
│   │   └── _shared/        # 共用工具
│   │       ├── email.ts
│   │       ├── validation.ts
│   │       └── response.ts
│   ├── migrations/         # 資料庫遷移
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_verification_codes.sql
│   │   ├── 003_create_sessions.sql
│   │   └── 004_create_transactions.sql
│   └── seed/              # 測試資料
│       └── test_data.sql
└── tests/
    ├── unit/              # 單元測試
    │   ├── auth.test.ts
    │   ├── validation.test.ts
    │   └── email.test.ts
    └── integration/       # 整合測試
        ├── auth-flow.test.ts
        └── accounting-flow.test.ts

frontend/
├── lib/
│   ├── main.dart          # 應用程式入口
│   ├── app.dart           # App 設定
│   ├── core/              # 核心功能
│   │   ├── constants/
│   │   ├── utils/
│   │   └── theme/
│   ├── data/              # 資料層
│   │   ├── models/
│   │   │   ├── user.dart
│   │   │   ├── transaction.dart
│   │   │   └── verification_code.dart
│   │   ├── repositories/
│   │   │   ├── auth_repository.dart
│   │   │   └── transaction_repository.dart
│   │   └── providers/     # Riverpod providers
│   │       ├── auth_provider.dart
│   │       └── transaction_provider.dart
│   ├── presentation/      # UI 層
│   │   ├── auth/
│   │   │   ├── register_screen.dart
│   │   │   ├── verify_email_screen.dart
│   │   │   └── login_screen.dart
│   │   ├── accounting/
│   │   │   ├── home_screen.dart
│   │   │   ├── add_transaction_screen.dart
│   │   │   └── widgets/
│   │   │       ├── financial_summary.dart
│   │   │       └── transaction_list.dart
│   │   └── common/
│   │       └── widgets/
│   └── services/          # 服務層
│       ├── api_service.dart
│       ├── storage_service.dart
│       └── sync_service.dart
└── test/
    ├── unit/              # 單元測試
    │   ├── models/
    │   ├── repositories/
    │   └── services/
    ├── widget/            # Widget 測試
    │   ├── auth/
    │   └── accounting/
    └── integration/       # 整合測試
        ├── auth_flow_test.dart
        └── accounting_flow_test.dart
```

**結構決策**: 採用 Mobile + API 架構,前端使用 Flutter 搭配 Clean Architecture 分層(data/domain/presentation),後端使用 Supabase Edge Functions 提供 RESTful API。此架構支援關注點分離、易於測試、並為未來功能擴充提供彈性。

## 複雜度追蹤

> **僅在 Constitution Check 有需要理由的違規項目時填寫**

| 違規項目 | 為何需要 | 拒絕更簡單替代方案的原因 |
|---------|---------|------------------------|
| 無 | N/A | N/A |
