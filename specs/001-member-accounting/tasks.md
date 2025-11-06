# 任務清單:會員註冊與登入系統以及記帳主頁功能

**輸入**: 設計文件來自 `/specs/001-member-accounting/`  
**前置需求**: plan.md (必要), spec.md (必要), research.md, data-model.md, contracts/

**Constitution 合規性**: 所有任務必須遵循 `.specify/memory/constitution.md` 原則:
- 測試優先 (不可妥協): 測試先寫且必須失敗後才實作
- 程式碼品質: Linting、文件、單一職責
- UX 一致性: 錯誤處理、無障礙、使用者回饋
- 效能: 優化查詢、測量基準、保持在目標內
- 文件語言: 所有使用者文件和此任務清單使用繁體中文 (zh-TW)

**組織方式**: 任務依使用者故事分組,以便每個故事可獨立實作和測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行(不同檔案、無相依性)
- **[Story]**: 此任務屬於哪個使用者故事 (例如: US1, US2, US3)
- 描述中包含確切的檔案路徑

## 路徑慣例

本專案採用 Mobile + API 架構:
- **後端**: `backend/supabase/`
- **前端**: `frontend/lib/`
- **測試**: `backend/tests/`, `frontend/test/`

---

## Phase 1: 專案設定 (共用基礎建設)

**目的**: 專案初始化和基本結構建立

- [X] T001 建立專案根目錄結構 (backend/, frontend/)
- [ ] T002 初始化 Flutter 專案 (frontend/) 並安裝相依套件 (riverpod, dio, flutter_secure_storage, flutter_form_builder) - **需要先安裝 Flutter SDK**
- [ ] T003 [P] 初始化 Supabase 專案 (backend/supabase/) 並設定 Edge Functions 環境 - **需要先安裝 Supabase CLI**
- [X] T004 [P] 設定 Flutter linting 工具 (flutter_lints) 和格式化 (dart format) - **已建立 analysis_options.yaml**
- [ ] T005 [P] 設定 Deno linting 工具 (deno fmt, deno lint) - **需要先安裝 Deno**
- [X] T006 建立環境變數範本檔案 (.env.example) 並記錄必要設定
- [ ] T007 設定 VS Code 工作區設定 (.vscode/) 包含 Flutter 和 Dart 擴充套件建議

---

## Phase 2: 基礎建設 (阻塞性前置需求)

**目的**: 所有使用者故事實作前必須完成的核心基礎建設

**⚠️ 關鍵**: 此階段完成前,不可開始任何使用者故事的工作

### 資料庫與遷移

- [X] T008 建立資料庫遷移腳本 001_create_users.sql (backend/supabase/migrations/)
- [X] T009 [P] 建立資料庫遷移腳本 002_create_verification_codes.sql (backend/supabase/migrations/)
- [X] T010 [P] 建立資料庫遷移腳本 003_create_sessions.sql (backend/supabase/migrations/)
- [X] T011 [P] 建立資料庫遷移腳本 004_create_transactions.sql (backend/supabase/migrations/)
- [ ] T012 執行所有資料庫遷移並驗證資料表建立成功 - **需要先啟動 Supabase**

### 共用工具與中介層

- [ ] T013 [P] 實作 Email 發送服務 (backend/supabase/functions/_shared/email.ts) 整合 Resend API
- [ ] T014 [P] 實作共用驗證工具 (backend/supabase/functions/_shared/validation.ts) 包含 Email 和密碼驗證
- [ ] T015 [P] 實作統一 API 回應格式 (backend/supabase/functions/_shared/response.ts)
- [ ] T016 實作 JWT 中介層 (backend/supabase/functions/_shared/auth-middleware.ts) 用於保護端點
- [ ] T017 [P] 實作錯誤處理中介層 (backend/supabase/functions/_shared/error-handler.ts)

### 前端核心架構

- [ ] T018 建立 Flutter 應用程式入口點 (frontend/lib/main.dart) 和應用程式設定 (frontend/lib/app.dart)
- [ ] T019 [P] 建立主題設定 (frontend/lib/core/theme/) 包含 Material 3 配色和樣式
- [ ] T020 [P] 建立常數定義 (frontend/lib/core/constants/) 包含 API 端點、錯誤訊息等
- [ ] T021 實作 API 服務基礎類別 (frontend/lib/services/api_service.dart) 整合 Dio 和攔截器
- [ ] T022 [P] 實作本地儲存服務 (frontend/lib/services/storage_service.dart) 使用 flutter_secure_storage
- [ ] T023 [P] 建立共用 Widget 元件 (frontend/lib/presentation/common/widgets/) 包含載入指示器、錯誤顯示等

**檢查點**: 基礎建設完成 - 現在可以開始平行實作使用者故事

---

## Phase 3: 使用者故事 1 - 新使用者註冊並驗證帳號 (優先級: P1) 🎯 MVP

**目標**: 新使用者可以註冊帳號、接收 Email 驗證碼、完成驗證並自動登入

**獨立測試**: 
1. 填寫註冊表單 (姓名、Email、密碼、確認密碼)
2. 提交後檢查是否收到 Email 驗證碼 (開發環境查看 Inbucket)
3. 輸入正確的 6 位數驗證碼
4. 確認帳號建立成功並自動登入進入記帳主頁

### 資料模型 (US1)

- [ ] T024 [P] [US1] 建立 User Dart 模型 (frontend/lib/data/models/user.dart) 包含 fromJson/toJson
- [ ] T025 [P] [US1] 建立 VerificationCode Dart 模型 (frontend/lib/data/models/verification_code.dart)

### 後端 API (US1)

#### 測試優先 (TDD)

- [ ] T026a [P] [US1] 撰寫註冊 API 端點測試 (backend/tests/auth/register.test.ts) 包含測試案例:成功註冊、Email 已存在、Email 格式錯誤、密碼不符規則、驗證碼發送失敗。執行測試並確認失敗。
- [ ] T027a [P] [US1] 撰寫 Email 驗證 API 端點測試 (backend/tests/auth/verify-email.test.ts) 包含測試案例:成功驗證、驗證碼錯誤、驗證碼過期、驗證碼鎖定(5 次錯誤)。執行測試並確認失敗。

#### 實作

- [ ] T026 [P] [US1] 實作註冊 API 端點 (backend/supabase/functions/auth/register.ts) 包含 Email 驗證、密碼驗證、驗證碼產生和發送。執行測試並確認通過。
- [ ] T027 [P] [US1] 實作 Email 驗證 API 端點 (backend/supabase/functions/auth/verify-email.ts) 包含驗證碼比對、使用者建立、JWT 產生。執行測試並確認通過。
- [ ] T028 [US1] 為註冊和驗證端點新增錯誤處理 (重複 Email、驗證碼過期、鎖定等)
- [ ] T029 [US1] 實作驗證碼冷卻時間檢查 (60 秒限制) 和鎖定機制 (5 次錯誤)

### 前端實作 (US1)

- [ ] T030 [P] [US1] 建立認證 Repository (frontend/lib/data/repositories/auth_repository.dart) 包含註冊和驗證方法
- [ ] T031 [US1] 建立認證 Provider (frontend/lib/data/providers/auth_provider.dart) 使用 Riverpod 管理狀態
- [ ] T032 [P] [US1] 實作註冊畫面 UI (frontend/lib/presentation/auth/register_screen.dart) 包含表單驗證
- [ ] T033 [P] [US1] 實作 Email 驗證畫面 UI (frontend/lib/presentation/auth/verify_email_screen.dart) 包含驗證碼輸入
- [ ] T034 [US1] 整合註冊流程與 API (提交表單 → 發送驗證碼 → 跳轉驗證畫面)
- [ ] T035 [US1] 整合驗證流程與 API (輸入驗證碼 → 驗證成功 → 儲存 Token → 自動登入)
- [ ] T036 [US1] 實作即時表單驗證 (密碼規則、Email 格式、密碼一致性)
- [ ] T037 [US1] 新增重新發送驗證碼功能 (含 60 秒冷卻計時器)
- [ ] T038 [US1] 處理所有錯誤情境 (Email 已註冊、驗證碼錯誤、過期、鎖定等) 並顯示繁體中文錯誤訊息

**檢查點**: 使用者故事 1 應完全可運作且可獨立測試

---

## Phase 4: 使用者故事 2 - 已註冊使用者登入 (優先級: P1) 🎯 MVP

**目標**: 已註冊使用者可以使用 Email 和密碼登入,並支援自動登入 (7 天會話)

**獨立測試**:
1. 使用已註冊的帳號 (US1 建立的帳號)
2. 輸入正確的 Email 和密碼
3. 點擊登入,確認成功進入記帳主頁
4. 關閉應用程式後重新開啟,確認自動登入
5. 測試登出功能,確認返回登入頁面

### 資料模型 (US2)

- [ ] T039 [P] [US2] 建立 Session Dart 模型 (frontend/lib/data/models/session.dart) (如需要,可能已在 User 中包含)

### 後端 API (US2)

#### 測試優先 (TDD)

- [ ] T040a [P] [US2] 撰寫登入 API 端點測試 (backend/tests/auth/login.test.ts) 包含測試案例:成功登入、Email 或密碼錯誤、帳號未驗證、Session 建立成功、JWT 有效性。執行測試並確認失敗。
- [ ] T041a [P] [US2] 撰寫登出 API 端點測試 (backend/tests/auth/logout.test.ts) 包含測試案例:成功登出、Session 刪除成功、無效 Token。執行測試並確認失敗。

#### 實作

- [ ] T040 [P] [US2] 實作登入 API 端點 (backend/supabase/functions/auth/login.ts) 包含密碼比對、Session 建立、JWT 產生。執行測試並確認通過。
- [ ] T041 [P] [US2] 實作登出 API 端點 (backend/supabase/functions/auth/logout.ts) 包含 Session 刪除。執行測試並確認通過。
- [ ] T042 [US2] 為登入端點新增帳號未驗證檢查 (顯示錯誤並提供重新發送驗證碼)
- [ ] T043 [US2] 實作 Session 管理邏輯 (建立、驗證、過期檢查)
- [ ] T043a [US2] 實作 Session 數量限制 (最多 5 個裝置,超過時自動刪除最舊 Session) 並新增測試

### 前端實作 (US2)

- [ ] T044 [US2] 擴充認證 Repository (frontend/lib/data/repositories/auth_repository.dart) 新增登入和登出方法
- [ ] T045 [US2] 擴充認證 Provider (frontend/lib/data/providers/auth_provider.dart) 管理登入狀態和自動登入
- [ ] T046 [P] [US2] 實作登入畫面 UI (frontend/lib/presentation/auth/login_screen.dart) 包含表單驗證
- [ ] T047 [US2] 整合登入流程與 API (提交表單 → 驗證 → 儲存 Token → 導航至主頁)
- [ ] T048 [US2] 實作自動登入邏輯 (應用程式啟動時檢查 Token 有效性)
- [ ] T049 [US2] 實作登出功能 (清除本地 Token 和 Session)
- [ ] T050 [US2] 處理登入錯誤情境 (Email/密碼錯誤、帳號未驗證) 並顯示繁體中文錯誤訊息
- [ ] T051 [US2] 實作密碼顯示/隱藏切換功能

**檢查點**: 使用者故事 1 和 2 應都能獨立運作

---

## Phase 5: 使用者故事 3 - 查看財務概覽 (優先級: P2)

**目標**: 登入後的使用者可以看到財務概覽,包含總收入、總支出、結餘

**獨立測試**:
1. 使用已登入的帳號
2. 進入記帳主頁,確認顯示財務概覽 (初始為 ¥0)
3. 新增收支記錄後 (US4),確認財務概覽即時更新

### 後端 API (US3)

#### 測試優先 (TDD)

- [ ] T052a [P] [US3] 撰寫財務概覽 API 端點測試 (backend/tests/accounting/get-summary.test.ts) 包含測試案例:初始狀態全為 0、新增收入後總收入正確、新增支出後總支出正確、結餘計算正確(收入-支出)、JWT 認證保護。執行測試並確認失敗。

#### 實作

- [ ] T052 [P] [US3] 實作財務概覽 API 端點 (backend/supabase/functions/accounting/get-summary.ts) 計算總收入、總支出、結餘。執行測試並確認通過。
- [ ] T053 [US3] 為財務概覽端點新增 JWT 認證保護
- [ ] T054 [US3] 優化財務概覽查詢效能 (使用 SQL 聚合函數)

### 前端實作 (US3)

- [ ] T055 [P] [US3] 建立財務概覽 Widget (frontend/lib/presentation/accounting/widgets/financial_summary.dart) 顯示收入、支出、結餘
- [ ] T056 [P] [US3] 實作記帳主頁畫面基本架構 (frontend/lib/presentation/accounting/home_screen.dart)
- [ ] T057 [US3] 建立交易 Repository (frontend/lib/data/repositories/transaction_repository.dart) 包含取得概覽方法
- [ ] T058 [US3] 建立交易 Provider (frontend/lib/data/providers/transaction_provider.dart) 管理財務概覽狀態
- [ ] T059 [US3] 整合財務概覽 API 與 UI (載入資料、顯示、錯誤處理)
- [ ] T060 [US3] 實作個人化問候語顯示 (「您好,{姓名}」)
- [ ] T061 [US3] 新增載入狀態指示器和錯誤處理

**檢查點**: 使用者故事 3 應能獨立運作

---

## Phase 6: 使用者故事 4 - 新增收支記錄 (優先級: P2)

**目標**: 使用者可以新增收入或支出記錄,包含類別、金額、備註

**獨立測試**:
1. 在記帳主頁點擊「新增記錄」
2. 選擇類型 (收入/支出)
3. 選擇類別,輸入金額和備註
4. 儲存後確認記錄出現在交易列表 (US5)
5. 確認財務概覽更新 (US3)

### 資料模型 (US4)

- [ ] T062 [P] [US4] 建立 Transaction Dart 模型 (frontend/lib/data/models/transaction.dart) 包含 fromJson/toJson

### 後端 API (US4)

#### 測試優先 (TDD)

- [ ] T063a [P] [US4] 撰寫新增交易 API 端點測試 (backend/tests/accounting/create-transaction.test.ts) 包含測試案例:成功新增收入、成功新增支出、金額超過上限、金額格式錯誤(超過 2 位小數)、無效類別、JWT 認證保護、RLS 隔離測試。執行測試並確認失敗。

#### 實作

- [ ] T063 [P] [US4] 實作新增交易 API 端點 (backend/supabase/functions/accounting/create-transaction.ts) 包含類別驗證、金額驗證。執行測試並確認通過。
- [ ] T064 [US4] 為新增交易端點新增 JWT 認證保護
- [ ] T065 [US4] 實作金額驗證 (小數點後 2 位、上限 1,000,000.00)
- [ ] T066 [US4] 實作類別驗證 (收入/支出類別白名單)
- [ ] T067 [US4] 新增 Row Level Security 策略確保使用者只能新增自己的記錄

### 前端實作 (US4)

- [ ] T068 [US4] 擴充交易 Repository (frontend/lib/data/repositories/transaction_repository.dart) 新增建立交易方法
- [ ] T069 [P] [US4] 實作新增交易畫面 UI (frontend/lib/presentation/accounting/add_transaction_screen.dart) 包含類型選擇、類別選擇、金額輸入、備註輸入
- [ ] T070 [US4] 實作類別選項動態顯示 (根據收入/支出類型切換)
- [ ] T071 [US4] 實作金額輸入驗證 (必填、數字格式、上限檢查)
- [ ] T072 [US4] 整合新增交易 API (提交表單 → 儲存 → 返回主頁 → 更新概覽和列表)
- [ ] T073 [US4] 實作儲存成功後的狀態更新 (通知 Provider 重新整理財務概覽和交易列表)
- [ ] T074 [US4] 新增表單驗證和錯誤處理 (金額必填、超過上限等) 並顯示繁體中文錯誤訊息

**檢查點**: 使用者故事 4 應能獨立運作,且與 US3 整合正常

---

## Phase 7: 使用者故事 5 - 查看交易記錄列表 (優先級: P3)

**目標**: 使用者可以查看所有歷史收支記錄,最新在最上方,收入/支出以不同顏色區分

**獨立測試**:
1. 新增多筆收支記錄 (US4)
2. 在記帳主頁查看交易列表
3. 確認記錄依時間倒序排列
4. 確認收入顯示為綠色 (+金額),支出顯示為紅色 (-金額)
5. 確認每筆記錄顯示類別、金額、備註、時間

### 後端 API (US5)

#### 測試優先 (TDD)

- [ ] T075a [P] [US5] 撰寫查詢交易列表 API 端點測試 (backend/tests/accounting/get-transactions.test.ts) 包含測試案例:成功查詢列表、空列表、分頁功能(cursor)、最多 100 筆/頁限制、倒序排列、JWT 認證保護、RLS 隔離測試。執行測試並確認失敗。

#### 實作

- [ ] T075 [P] [US5] 實作查詢交易列表 API 端點 (backend/supabase/functions/accounting/get-transactions.ts) 包含分頁、排序。執行測試並確認通過。
- [ ] T076 [US5] 為查詢交易端點新增 JWT 認證保護
- [ ] T077 [US5] 實作游標分頁 (cursor-based pagination) 支援最多 100 筆/頁
- [ ] T078 [US5] 新增 Row Level Security 策略確保使用者只能查詢自己的記錄
- [ ] T079 [US5] 優化查詢效能 (建立時間索引、限制查詢欄位)

### 前端實作 (US5)

- [ ] T080 [US5] 擴充交易 Repository (frontend/lib/data/repositories/transaction_repository.dart) 新增查詢交易列表方法
- [ ] T081 [P] [US5] 建立交易列表 Widget (frontend/lib/presentation/accounting/widgets/transaction_list.dart) 顯示所有交易記錄
- [ ] T082 [US5] 整合交易列表到記帳主頁 (frontend/lib/presentation/accounting/home_screen.dart)
- [ ] T083 [US5] 實作交易項目顯示邏輯 (收入綠色 +金額、支出紅色 -金額)
- [ ] T084 [US5] 實作空狀態顯示 (「尚無交易記錄」)
- [ ] T085 [US5] 實作載入更多功能 (分頁載入)
- [ ] T086 [US5] 新增下拉重新整理功能
- [ ] T087 [US5] 處理載入狀態和錯誤情境

**檢查點**: 所有使用者故事 (1-5) 應能獨立且整合運作

---

## Phase 8: 離線支援與同步 (跨故事功能)

**目的**: 實作網路中斷時的本地暫存和自動同步

- [ ] T088 [P] [US4] 實作本地暫存交易記錄功能 (frontend/lib/services/sync_service.dart)
- [ ] T089 [US4] 實作網路狀態監聽和自動同步邏輯
- [ ] T090 [US4] 實作本地暫存資料 7 天自動清理機制
- [ ] T091 [US4] 新增同步狀態指示器 (顯示未同步筆數)

---

## Phase 9: 打磨與跨領域改進

**目的**: 影響多個使用者故事的改進

### 無障礙與 UX

- [ ] T092 [P] 為所有互動元素新增語意標籤 (Semantics widget)
- [ ] T093 [P] 驗證色彩對比度符合 WCAG AA 標準 (最低 4.5:1)
- [ ] T094 支援鍵盤操作 (Tab 切換、Enter 提交)
- [ ] T095 為所有按鈕新增觸覺回饋 (HapticFeedback)

### 效能優化

- [ ] T096 [P] 優化資料庫查詢 (新增索引、使用聚合函數)
- [ ] T097 [P] 實作 API 回應快取策略
- [ ] T098a [P] 測量註冊流程效能 (目標: 註冊 API <500ms p95) 使用 k6 負載測試
- [ ] T098b [P] 測量登入流程效能 (目標: 登入 API <300ms p95) 使用 k6 負載測試
- [ ] T098c [P] 測量新增交易效能 (目標: 新增交易 API <400ms p95) 使用 k6 負載測試
- [ ] T098d [P] 測量查詢列表效能 (目標: 查詢列表 API <500ms p95) 使用 k6 負載測試
- [ ] T098e [P] 測量主頁載入效能 (目標: 完整頁面載入 <2s) 使用 Lighthouse 測試
- [ ] T098f [P] 測量 Email 發送效能 (目標: Email 發送 <30s) 使用後端日誌分析
- [ ] T099 實作圖片和資源延遲載入

### 安全性

- [ ] T100 [P] 驗證所有使用者輸入已清理 (防止 SQL Injection)
- [ ] T101 [P] 檢查所有 API 端點已受 JWT 保護
- [ ] T102 實作 Rate Limiting (防止暴力破解)
- [ ] T103 驗證敏感資料 (密碼、Token) 已加密儲存

### 文件與測試

- [ ] T104 [P] 更新 quickstart.md 包含最新的設定步驟
- [ ] T105 [P] 為所有 API 端點撰寫 JSDoc 文件註解
- [ ] T106 [P] 為所有 Dart 類別撰寫 Dartdoc 文件註解
- [ ] T107 執行完整的註冊登入流程測試 (依 quickstart.md 驗證)
- [ ] T108 執行完整的記帳流程測試 (新增記錄 → 查看概覽 → 查看列表)

### Code Review 與品質閘門

- [ ] T109 建立 Code Review 檢查清單 (基於 QC-007 要求:安全性、效能、可讀性、測試覆蓋率、Constitution 合規性)
- [ ] T110 執行 Code Review 並記錄審核結果於 specs/001-member-accounting/code-review.md
- [ ] T111 驗證所有 API 端點有完整單元測試覆蓋 (QC-004: >80% 程式碼覆蓋率)

### 邊緣案例測試

- [ ] T112 [P] 測試重複 Email 註冊被拒絕 (frontend/test/integration/auth/duplicate_email_test.dart)
- [ ] T113 [P] 測試驗證碼 5 次錯誤鎖定機制 (frontend/test/integration/auth/code_locked_test.dart)
- [ ] T114 [P] 測試網路中斷時本地暫存功能 (frontend/test/integration/offline/local_cache_test.dart)
- [ ] T115 [P] 測試多裝置同時登入限制 (最多 5 個 Session) (backend/tests/auth/multi_device_test.ts)
- [ ] T116 [P] 測試超大金額輸入被拒絕 (>¥1,000,000) (frontend/test/unit/validation/amount_limit_test.dart)
- [ ] T117 [P] 測試特殊字元密碼被拒絕 (frontend/test/unit/validation/password_special_chars_test.dart)
- [ ] T118 [P] 測試未驗證帳號登入提示 (frontend/test/integration/auth/unverified_login_test.dart)

### 部署準備

- [ ] T119 [P] 建立正式環境 .env 範本 (.env.production.example)
- [ ] T120 更新所有 TODO 註解標記的 Supabase URL 和 API Keys
- [ ] T121 建立部署檢查清單 (環境變數、資料庫遷移、API 部署)

---

## 相依性與執行順序

### 階段相依性

- **專案設定 (Phase 1)**: 無相依性 - 可立即開始
- **基礎建設 (Phase 2)**: 相依於專案設定完成 - **阻塞所有使用者故事**
- **使用者故事 (Phase 3-7)**: 全部相依於基礎建設完成
  - 使用者故事可以平行進行 (如有人力)
  - 或依優先順序循序進行 (P1 → P2 → P3)
- **離線支援 (Phase 8)**: 相依於 US4 完成
- **打磨 (Phase 9)**: 相依於所有期望的使用者故事完成

### 使用者故事相依性

- **使用者故事 1 (P1)**: 基礎建設完成後可開始 - 無其他故事相依性
- **使用者故事 2 (P1)**: 基礎建設完成後可開始 - 無其他故事相依性 (但實務上需要 US1 建立的帳號來測試)
- **使用者故事 3 (P2)**: 基礎建設完成後可開始 - 與 US1/US2 整合但可獨立測試
- **使用者故事 4 (P2)**: 基礎建設完成後可開始 - 與 US3 整合但可獨立測試
- **使用者故事 5 (P3)**: 基礎建設完成後可開始 - 與 US4 整合但可獨立測試

### 每個使用者故事內部

- 模型先於服務
- 服務先於端點
- 後端 API 先於前端整合
- 核心實作先於整合
- 故事完成後才移到下一個優先級

### 平行執行機會

- 所有標記 [P] 的專案設定任務可平行執行
- 所有標記 [P] 的基礎建設任務可平行執行 (在 Phase 2 內)
- 基礎建設完成後,所有使用者故事可平行開始 (如團隊容量允許)
- 每個故事內標記 [P] 的模型可平行執行
- 不同使用者故事可由不同團隊成員平行工作

---

## 平行執行範例: 使用者故事 1

```bash
# 同時啟動使用者故事 1 的所有模型:
任務 T024: "建立 User Dart 模型 (frontend/lib/data/models/user.dart)"
任務 T025: "建立 VerificationCode Dart 模型 (frontend/lib/data/models/verification_code.dart)"

# 同時啟動使用者故事 1 的所有測試 (TDD):
任務 T026a: "撰寫註冊 API 端點測試 (backend/tests/auth/register.test.ts)"
任務 T027a: "撰寫 Email 驗證 API 端點測試 (backend/tests/auth/verify-email.test.ts)"

# 確認測試失敗後,同時啟動使用者故事 1 的所有後端 API:
任務 T026: "實作註冊 API 端點 (backend/supabase/functions/auth/register.ts)"
任務 T027: "實作 Email 驗證 API 端點 (backend/supabase/functions/auth/verify-email.ts)"

# 同時啟動使用者故事 1 的所有前端畫面:
任務 T032: "實作註冊畫面 UI (frontend/lib/presentation/auth/register_screen.dart)"
任務 T033: "實作 Email 驗證畫面 UI (frontend/lib/presentation/auth/verify_email_screen.dart)"
```

---

## 實作策略

### MVP 優先 (僅使用者故事 1 和 2)

1. 完成 Phase 1: 專案設定
2. 完成 Phase 2: 基礎建設 (**關鍵** - 阻塞所有故事)
3. 完成 Phase 3: 使用者故事 1 (註冊驗證)
4. 完成 Phase 4: 使用者故事 2 (登入登出)
5. **停止並驗證**: 獨立測試 US1 和 US2
6. 如果準備好則部署/展示

### 漸進式交付

1. 完成專案設定 + 基礎建設 → 基礎準備完成
2. 新增使用者故事 1 → 獨立測試 → 部署/展示 (MVP!)
3. 新增使用者故事 2 → 獨立測試 → 部署/展示 (完整認證!)
4. 新增使用者故事 3 → 獨立測試 → 部署/展示 (財務概覽!)
5. 新增使用者故事 4 → 獨立測試 → 部署/展示 (記帳功能!)
6. 新增使用者故事 5 → 獨立測試 → 部署/展示 (完整功能!)
7. 每個故事都新增價值且不破壞先前故事

### 平行團隊策略

多位開發者時:

1. 團隊一起完成專案設定 + 基礎建設
2. 基礎建設完成後:
   - 開發者 A: 使用者故事 1 (註冊驗證)
   - 開發者 B: 使用者故事 2 (登入登出)
   - 開發者 C: 使用者故事 3 (財務概覽)
3. 故事獨立完成並整合

---

## 任務統計

- **總任務數**: 136 個任務 (原 111 個 + 新增 25 個測試/品質任務)
- **Phase 1 (專案設定)**: 7 個任務
- **Phase 2 (基礎建設)**: 16 個任務
- **Phase 3 (US1 - 註冊驗證)**: 17 個任務 (新增 2 個 TDD 測試任務)
- **Phase 4 (US2 - 登入登出)**: 16 個任務 (新增 2 個 TDD 測試任務 + 1 個多裝置限制任務)
- **Phase 5 (US3 - 財務概覽)**: 11 個任務 (新增 1 個 TDD 測試任務)
- **Phase 6 (US4 - 新增記錄)**: 14 個任務 (新增 1 個 TDD 測試任務)
- **Phase 7 (US5 - 交易列表)**: 14 個任務 (新增 1 個 TDD 測試任務)
- **Phase 8 (離線支援)**: 4 個任務
- **Phase 9 (打磨)**: 37 個任務 (新增 5 個效能測試拆分 + 3 個 Code Review 任務 + 7 個邊緣案例測試 + 2 個部署任務編號調整)

**新增任務類別**:
- **TDD 測試任務**: 7 個 (T026a, T027a, T040a, T041a, T052a, T063a, T075a)
- **Code Review 與品質**: 3 個 (T109-T111)
- **邊緣案例測試**: 7 個 (T112-T118)
- **效能測試拆分**: 6 個 (T098a-f,取代原 T098)
- **多裝置限制**: 1 個 (T043a)
- **部署任務編號調整**: +3 (T119-T121)

**平行執行機會**:
- Phase 1: 5 個任務可平行
- Phase 2: 9 個任務可平行
- 使用者故事 1-5: 多個任務可在不同故事間平行
- Phase 9 測試任務: 13 個任務可平行 (所有 [P] 標記的測試)

**建議 MVP 範圍**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2) = 完整的註冊登入系統 (含 TDD 測試)

---

## 注意事項

- [P] 任務 = 不同檔案,無相依性
- [Story] 標籤將任務對應到特定使用者故事以便追蹤
- 每個使用者故事應可獨立完成和測試
- 在任何檢查點停止以獨立驗證故事
- 避免: 模糊任務、相同檔案衝突、破壞獨立性的跨故事相依性
- 每個任務或邏輯群組後提交程式碼
- 遵循 TDD 工作流程: 先寫測試(如適用) → 確認失敗 → 實作 → 確認通過
