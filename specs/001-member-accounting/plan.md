# 實作計畫:會員註冊與登入系統以及記帳主頁功能

**分支**: `001-member-accounting` | **日期**: 2025-11-12 | **規格**: [spec.md](./spec.md)  
**輸入**: 功能規格來自 `/specs/001-member-accounting/spec.md`

## 摘要

本功能實作完整的會員註冊與登入系統,包含 Email 驗證流程和記帳主頁的基本收支記錄功能。

**主要需求**:

- 使用者可透過 Email 註冊帳號並完成驗證
- 註冊使用者可使用 Email/密碼登入,支援自動登入(7 天有效期)
- 登入後可查看財務概覽(總收入、總支出、結餘)
- 使用者可新增、查看、刪除收支記錄

**技術方案**:

- **前端**: Flutter 3.16+ + Riverpod 狀態管理 + Material 3 UI
- **後端**: Supabase (Auth + PostgreSQL + Edge Functions) + Hono Server
- **Email 服務**: Resend Email API
- **測試策略**: TDD 方法,目標覆蓋率 >80%
- **效能目標**: API <500ms (p95), 資料庫查詢 <100ms (p95)

## 技術環境

### 前端技術棧

**語言/版本**: Dart 3.2+ (Flutter 3.16+)  
**主要相依套件**:

- `flutter_riverpod` 2.4.0+ (狀態管理)
- `dio` 5.4.0+ (HTTP 客戶端)
- `flutter_secure_storage` 9.0.0+ (安全儲存)
- `flutter_form_builder` 9.0.0+ (表單處理)
- Material 3 (UI 元件庫)

**儲存**:

- 本地: flutter_secure_storage (JWT Token、使用者資訊)
- 本地: shared_preferences (離線佇列)

**測試**:

- Flutter Test (Unit/Widget/Integration)
- Mockito (Mock 物件)
- 目標覆蓋率: >80%

**目標平台**: iOS 13+ / Android 6.0+ (API 23+)

**專案類型**: Mobile (Flutter 跨平台)

### 後端技術棧

**語言/版本**: TypeScript (Deno 2.5.6+)  
**主要相依套件**:

- Supabase (BaaS 平台)
- Hono (Web 框架)
- bcrypt (密碼雜湊)
- Resend (Email API)

**儲存**: PostgreSQL 14+ (Supabase 提供)

**測試**: Deno 內建測試框架

**目標平台**: Supabase Edge Functions (Deno Runtime)

**專案類型**: Serverless API

### 效能目標

**效能目標**:

- API 回應時間: <500ms (p95)
- 資料庫查詢: <100ms (p95)
- Email 發送: <30 秒送達
- 前端首次載入: <2 秒 (3G 網路)
- UI 互動回應: <100ms

**限制條件**:

- 會話有效期限: 7 天
- 驗證碼有效期限: 5 分鐘
- 單筆交易金額上限: 1,000,000.00
- 同時登入裝置數: 最多 5 個
- 離線暫存期限: 7 天

**規模/範圍**:

- 初期目標使用者: 1,000 人
- 預計頁面數: 5 個主要畫面
- 預計 API 端點: 8 個

## Constitution 檢核

_關卡:必須在 Phase 0 研究前通過。Phase 1 設計後重新檢核。_

**必要驗證** (基於 `.specify/memory/constitution.md`):

- [x] **程式碼品質**:
  - Linting: Dart Analysis + ESLint (Deno)
  - Formatting: dart format + deno fmt
  - 文件標準: JSDoc (後端) + Dart Doc (前端)
- [x] **測試標準**:
  - TDD 工作流程: Red-Green-Refactor 循環
  - 測試類型: Unit (>80%), Integration, Widget, E2E
  - 測試框架: Flutter Test + Deno Test
- [x] **使用者體驗**:
  - 無障礙: WCAG 2.1 AA 標準
  - 錯誤處理: 統一錯誤訊息格式,繁體中文
  - 互動回饋: 載入指示器、即時驗證、確認對話框
- [x] **效能**:
  - API: <500ms (p95)
  - UI: <100ms 互動回應
  - 資料庫: <100ms 查詢 (p95)
- [x] **文件語言**:
  - 所有規格文件使用繁體中文
  - UI 文字和錯誤訊息使用繁體中文
- [x] **品質關卡**:
  - Gate 1: 規格審查 ✓
  - Gate 2: 測試批准 (進行中)
  - Gate 3: 實作審查 (待執行)
  - Gate 4: 效能驗證 (待執行)
  - Gate 5: UX 驗證 (待執行)
  - Gate 6: 文件完成 ✓

**此功能的效能目標**:

- API 端點:
  - POST /register: <500ms (p95)
  - POST /verify-email: <300ms (p95)
  - POST /login: <300ms (p95)
  - GET /transactions: <500ms (p95)
  - POST /transactions: <400ms (p95)
  - DELETE /transactions/:id: <300ms (p95)
- UI 互動:
  - 按鈕回應: <100ms
  - 頁面載入: <2s (初次), <1s (後續)
  - 表單驗證: 即時 (<50ms)
- 資料庫查詢:
  - User lookup: <50ms
  - Transaction list (100 items): <100ms
  - Aggregate queries (sum): <80ms

**語言合規性**:

- [x] plan.md 使用繁體中文撰寫
- [x] spec.md 使用繁體中文撰寫
- [x] tasks.md 將使用繁體中文撰寫
- [x] 使用者文件使用繁體中文撰寫
- [x] UI 文字和錯誤訊息使用繁體中文

**需要理由的違規項目**: 無 - 所有 Constitution 要求皆符合

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
| -------- | -------- | ------------------------ |
| 無       | N/A      | N/A                      |
