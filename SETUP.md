# 環境設定指南

本文件提供完整的開發環境設定步驟。在開始實作前,請確保所有必需工具已正確安裝。

## ⚠️ 重要提示

本專案需要以下開發工具。由於當前環境未安裝 Flutter SDK,請先完成環境設定後再繼續實作。

## 安裝步驟

### 1. 安裝 Flutter SDK (必需)

Flutter 是本專案的前端框架,必須安裝才能開發和執行應用程式。

#### macOS 安裝

```bash
# 下載並安裝 Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter

# 加入 PATH (加入到 ~/.zshrc 或 ~/.bashrc)
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.zshrc
source ~/.zshrc

# 驗證安裝
flutter doctor
```

#### Linux 安裝

```bash
# 下載並安裝 Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter

# 加入 PATH
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.bashrc
source ~/.bashrc

# 驗證安裝
flutter doctor
```

#### Windows 安裝

1. 下載 Flutter SDK: https://docs.flutter.dev/get-started/install/windows
2. 解壓到 `C:\src\flutter`
3. 將 `C:\src\flutter\bin` 加入系統環境變數 PATH
4. 開啟新的命令提示字元,執行 `flutter doctor`

### 2. 安裝 Deno (Edge Functions 執行環境)

#### macOS / Linux

```bash
curl -fsSL https://deno.land/install.sh | sh

# 加入 PATH
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc  # 或 ~/.bashrc
source ~/.zshrc

# 驗證
deno --version
```

#### Windows

```powershell
irm https://deno.land/install.ps1 | iex
deno --version
```

### 3. 安裝 Supabase CLI (後端服務管理)

#### macOS

```bash
brew install supabase/tap/supabase
supabase --version
```

#### Linux

```bash
brew install supabase/tap/supabase
# 或使用 npm
npm install -g supabase
supabase --version
```

#### Windows

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
supabase --version
```

### 4. 安裝 Docker Desktop (本地 Supabase 環境)

Supabase 本地環境需要 Docker 容器執行。

- **macOS**: https://docs.docker.com/desktop/install/mac-install/
- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **Linux**: https://docs.docker.com/desktop/install/linux-install/

安裝後啟動 Docker Desktop。

### 5. 驗證安裝

執行以下命令確認所有工具已正確安裝:

```bash
# Flutter (必需)
flutter --version
flutter doctor

# Deno (必需)
deno --version

# Supabase CLI (必需)
supabase --version

# Docker (必需)
docker --version
docker ps

# Git (通常已安裝)
git --version
```

## 初始化專案

環境設定完成後,執行以下命令初始化專案:

```bash
# 1. 進入前端目錄並初始化 Flutter 專案
cd frontend
flutter create . --org com.familyaccounting --platforms ios,android

# 2. 安裝相依套件
flutter pub get

# 3. 返回專案根目錄
cd ..

# 4. 初始化 Supabase 本地環境
supabase init

# 5. 啟動 Supabase 本地環境
supabase start
```

## 後續步驟

環境設定完成後,請執行:

```bash
# 重新執行實作命令
/speckit.implement
```

系統將繼續從中斷的地方繼續實作。

## 常見問題

### Flutter Doctor 顯示警告

某些警告(如 Android Studio 未安裝)不會影響開發,可以忽略。關鍵檢查項:

- ✓ Flutter (Channel stable)
- ✓ Dart
- ✓ Chrome (用於 Web 開發)

### Docker 無法啟動

確保:
1. Docker Desktop 已安裝並執行
2. 有足夠的系統資源(至少 4GB RAM)
3. 虛擬化功能已啟用(BIOS 設定)

### Supabase Start 失敗

```bash
# 停止所有容器
supabase stop

# 清理並重新啟動
supabase start
```

## 參考資源

- Flutter 安裝指南: https://docs.flutter.dev/get-started/install
- Deno 安裝指南: https://deno.land/manual/getting_started/installation
- Supabase CLI 文件: https://supabase.com/docs/guides/cli
- Docker Desktop 文件: https://docs.docker.com/desktop/

## 聯絡支援

如遇到安裝問題,請參閱:
- [快速開始指南](../specs/001-member-accounting/quickstart.md)
- [專案 README](../README.md)
