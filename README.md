# 家庭記帳 APP - 會員註冊與登入系統

**功能分支**: `001-member-accounting`  
**狀態**: 開發中  
**最後更新**: 2025-11-06

## 專案概述

本專案實作家庭記帳應用程式的核心會員系統和記帳主頁功能,包含:

- ✅ 會員註冊(Email 驗證)
- ✅ 會員登入/登出
- ✅ 自動登入(7 天會話)
- ✅ 財務概覽(總收入、總支出、結餘)
- ✅ 新增收支記錄
- ✅ 交易記錄列表

## 技術架構

### 前端
- **框架**: Flutter 3.16+
- **狀態管理**: Riverpod 2.4.0+
- **HTTP 客戶端**: Dio 5.4.0+
- **本地儲存**: flutter_secure_storage 9.0.0+

### 後端
- **平台**: Supabase (Backend-as-a-Service)
- **API 框架**: Hono (Edge Functions)
- **資料庫**: PostgreSQL (Supabase)
- **Email 服務**: Resend API

## 快速開始

### 前置需求

請參閱 [快速開始指南](./specs/001-member-accounting/quickstart.md) 了解詳細的環境設定步驟。

必需工具:
- Flutter SDK 3.16.0+
- Deno 1.40.0+
- Supabase CLI 1.127.0+
- Docker Desktop (用於本地 Supabase 環境)
- Git 2.30.0+

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/your-org/familyaccoutting.git
cd familyaccoutting

# 2. 安裝 Flutter 相依套件
cd frontend
flutter pub get

# 3. 啟動 Supabase 本地環境
cd ..
supabase start

# 4. 套用資料庫遷移
supabase db reset

# 5. 部署 Edge Functions
supabase functions deploy

# 6. 啟動 Flutter 應用程式
cd frontend
flutter run -d chrome
```

## 專案結構

```text
familyaccoutting/
├── backend/
│   └── supabase/
│       ├── functions/           # Edge Functions (Deno)
│       │   ├── auth/           # 認證相關函式
│       │   ├── accounting/     # 記帳相關函式
│       │   └── _shared/        # 共用工具
│       ├── migrations/         # 資料庫遷移
│       └── seed/              # 測試資料
├── frontend/
│   └── lib/
│       ├── data/              # 資料層
│       │   ├── models/
│       │   ├── repositories/
│       │   └── providers/
│       ├── presentation/      # UI 層
│       │   ├── auth/
│       │   ├── accounting/
│       │   └── common/
│       └── services/          # 服務層
├── specs/                     # 功能規格文件
│   └── 001-member-accounting/
│       ├── spec.md           # 功能規格
│       ├── plan.md           # 實作計畫
│       ├── tasks.md          # 任務清單
│       ├── data-model.md     # 資料模型
│       ├── quickstart.md     # 快速開始指南
│       └── contracts/        # API 文件
└── README.md                 # 本檔案
```

## 開發指南

### 開發工作流程

```bash
# 啟動後端服務
supabase start
supabase functions serve --debug

# 在另一個終端啟動前端
cd frontend
flutter run --hot

# 執行測試
flutter test
```

### 程式碼品質

```bash
# 格式化程式碼
flutter format .
dart format .

# 分析程式碼
flutter analyze

# 執行測試並產生覆蓋率
flutter test --coverage
```

## 文件

- [功能規格](./specs/001-member-accounting/spec.md)
- [實作計畫](./specs/001-member-accounting/plan.md)
- [任務清單](./specs/001-member-accounting/tasks.md)
- [資料模型](./specs/001-member-accounting/data-model.md)
- [快速開始指南](./specs/001-member-accounting/quickstart.md)
- [API 文件 - 認證](./specs/001-member-accounting/contracts/api-auth.yaml)
- [API 文件 - 記帳](./specs/001-member-accounting/contracts/api-accounting.yaml)

## 進度追蹤

請參閱 [任務清單](./specs/001-member-accounting/tasks.md) 了解詳細的開發任務和進度。

### 當前狀態

- [x] Phase 0: 規格與計畫
- [ ] Phase 1: 專案設定
- [ ] Phase 2: 基礎建設
- [ ] Phase 3: 使用者故事 1 - 新使用者註冊
- [ ] Phase 4: 使用者故事 2 - 已註冊使用者登入
- [ ] Phase 5: 使用者故事 3 - 查看財務概覽
- [ ] Phase 6: 使用者故事 4 - 新增收支記錄
- [ ] Phase 7: 使用者故事 5 - 查看交易記錄列表
- [ ] Phase 8: 離線支援與同步
- [ ] Phase 9: 打磨與跨領域改進

## 授權

[待定]

## 聯絡資訊

- **技術支援**: dev@familyaccounting.com
- **專案 Issue**: https://github.com/your-org/familyaccoutting/issues
