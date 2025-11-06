# 下一步驟指南

本文件說明完成環境設定後的實作步驟。

## 當前狀態

✅ **已完成**:
- 專案目錄結構
- 資料庫遷移腳本(4 個)
- Flutter 配置文件(pubspec.yaml, analysis_options.yaml)
- Supabase 配置文件(config.toml)
- 環境變數範本(.env.example)
- 文件(README.md, SETUP.md, IMPLEMENTATION_STATUS.md)

⏸️ **暫停原因**: 開發環境未完整設定

## 必要的環境設定步驟

請按照以下順序完成環境設定:

### 1. 安裝 Flutter SDK (最重要)

```bash
# macOS/Linux
git clone https://github.com/flutter/flutter.git -b stable ~/flutter
export PATH="$PATH:$HOME/flutter/bin"
flutter doctor

# 接受 Android licenses (如使用 Android)
flutter doctor --android-licenses
```

詳細步驟請參閱 [SETUP.md](./SETUP.md)。

### 2. 安裝 Deno

```bash
# macOS/Linux
curl -fsSL https://deno.land/install.sh | sh
export PATH="$HOME/.deno/bin:$PATH"
deno --version
```

### 3. 安裝 Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase
supabase --version
```

### 4. 安裝並啟動 Docker Desktop

從官網下載安裝: https://www.docker.com/products/docker-desktop

確保 Docker 正在執行:
```bash
docker ps
```

## 環境設定完成後的步驟

### 步驟 1: 初始化 Flutter 專案

```bash
cd /Users/chunchun/文件/speckit/familyaccoutting/frontend

# 初始化 Flutter 專案(已有 pubspec.yaml,會自動使用)
flutter create . --org com.familyaccounting --platforms ios,android

# 安裝相依套件
flutter pub get

# 驗證
flutter doctor
flutter analyze
```

### 步驟 2: 初始化 Supabase

```bash
cd /Users/chunchun/文件/speckit/familyaccoutting/backend

# 初始化 Supabase 專案
supabase init

# 啟動本地 Supabase 環境
supabase start

# 記錄輸出的 API URL、anon key、service_role key
# 將這些值複製到 .env 檔案
```

### 步驟 3: 套用資料庫遷移

```bash
cd /Users/chunchun/文件/speckit/familyaccoutting/backend

# 套用所有遷移
supabase db reset

# 或逐一套用
supabase migration up

# 驗證資料表建立
supabase db diff
```

### 步驟 4: 設定環境變數

```bash
cd /Users/chunchun/文件/speckit/familyaccoutting

# 複製環境變數範本
cp .env.example .env

# 編輯 .env,填入 Supabase 啟動後的實際值
nano .env
```

將 `supabase start` 輸出的值填入 .env:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

### 步驟 5: 重新執行實作命令

環境準備完成後,重新執行:

```bash
cd /Users/chunchun/文件/speckit/familyaccoutting
/speckit.implement
```

系統將從中斷的地方繼續實作剩餘任務。

## 待實作的任務概覽

### Phase 1: 專案設定(剩餘)
- [ ] T002: 初始化 Flutter 專案並安裝相依套件
- [ ] T003: 初始化 Supabase 專案並設定 Edge Functions 環境
- [ ] T005: 設定 Deno linting 工具
- [ ] T007: 設定 VS Code 工作區設定

### Phase 2: 基礎建設
- [ ] T012: 執行資料庫遷移並驗證
- [ ] T013-T017: 實作共用工具(Email、驗證、回應格式、中介層)
- [ ] T018-T023: 建立前端核心架構(App、主題、API 服務、儲存服務)

### Phase 3-7: 使用者故事實作
- [ ] US1: 新使用者註冊並驗證帳號
- [ ] US2: 已註冊使用者登入
- [ ] US3: 查看財務概覽
- [ ] US4: 新增收支記錄
- [ ] US5: 查看交易記錄列表

### Phase 8: 離線支援
- [ ] 實作本地暫存和自動同步

### Phase 9: 打磨與優化
- [ ] 無障礙與 UX 改善
- [ ] 效能優化
- [ ] 安全性檢查
- [ ] 測試與文件

## 預估時間

環境設定完成後:
- Phase 1 剩餘: 1-2 小時
- Phase 2: 4-6 小時
- Phase 3-7: 20-30 小時(每個使用者故事 4-6 小時)
- Phase 8: 4-6 小時
- Phase 9: 8-12 小時

**總計**: 約 37-56 小時(5-7 個工作天)

## 驗證清單

環境設定完成後,確認以下項目:

- [ ] `flutter --version` 顯示 3.16.0+
- [ ] `flutter doctor` 無關鍵錯誤
- [ ] `deno --version` 顯示 1.40.0+
- [ ] `supabase --version` 顯示 1.127.0+
- [ ] `docker ps` 可執行
- [ ] `supabase start` 成功啟動
- [ ] `supabase status` 顯示所有服務 running
- [ ] 可存取 http://localhost:54323 (Supabase Studio)
- [ ] 可存取 http://localhost:54324 (Inbucket)
- [ ] `.env` 檔案已建立並填入實際值
- [ ] `flutter pub get` 在 frontend/ 目錄成功執行
- [ ] 資料庫遷移已套用(4 個資料表建立)

## 快速驗證腳本

環境設定完成後,執行此腳本驗證:

```bash
#!/bin/bash

echo "=== 環境驗證 ==="

# Flutter
echo -n "Flutter: "
flutter --version | head -n 1 || echo "❌ 未安裝"

# Deno
echo -n "Deno: "
deno --version | head -n 1 || echo "❌ 未安裝"

# Supabase
echo -n "Supabase CLI: "
supabase --version || echo "❌ 未安裝"

# Docker
echo -n "Docker: "
docker --version || echo "❌ 未安裝"

# Supabase 服務
echo -n "Supabase Services: "
supabase status | grep -q "started" && echo "✓ 執行中" || echo "❌ 未啟動"

echo ""
echo "=== 專案檔案 ==="
ls -1 backend/supabase/migrations/ | head -n 4
ls -1 frontend/ | grep -E "(pubspec.yaml|analysis_options.yaml)"

echo ""
echo "如所有項目顯示 ✓,即可執行: /speckit.implement"
```

## 常見問題

### Q1: Flutter 安裝後仍顯示 "command not found"

A: 確認 PATH 設定正確,並重新載入 shell:
```bash
source ~/.zshrc  # 或 ~/.bashrc
flutter doctor
```

### Q2: Supabase start 失敗

A: 確認 Docker Desktop 已啟動:
```bash
open -a Docker  # macOS
# 等待 Docker 完全啟動後重試
supabase start
```

### Q3: 資料庫遷移失敗

A: 重置資料庫:
```bash
supabase db reset
```

## 參考資源

- [環境設定詳細指南](./SETUP.md)
- [專案 README](./README.md)
- [實作進度報告](./IMPLEMENTATION_STATUS.md)
- [任務清單](./specs/001-member-accounting/tasks.md)
- [快速開始指南](./specs/001-member-accounting/quickstart.md)

---

**準備好後,執行**: `/speckit.implement`
