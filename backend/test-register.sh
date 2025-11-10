#!/bin/bash

# 註冊 API 測試腳本
# 使用方式: ./test-register.sh

echo "🧪 開始測試註冊 API..."
echo ""

# 確保 Supabase 本地環境正在執行
echo "📡 檢查 Supabase 本地環境..."
if ! curl -s http://127.0.0.1:54321/functions/v1/health > /dev/null 2>&1; then
  echo "❌ Supabase 本地環境未啟動"
  echo "   請先執行: cd backend/supabase && supabase start"
  exit 1
fi

echo "✅ Supabase 本地環境正在執行"
echo ""

# 載入環境變數
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 執行測試
echo "🚀 執行註冊 API 整合測試..."
echo ""

# 使用完整路徑執行 Deno (避免 PATH 問題)
DENO_BIN="${HOME}/.deno/bin/deno"
if [ ! -f "$DENO_BIN" ]; then
  DENO_BIN="deno"  # 如果找不到,嘗試使用 PATH 中的 deno
fi

$DENO_BIN test \
  backend/tests/integration/register.test.ts \
  --allow-net \
  --allow-env \
  --allow-read \
  --no-check

echo ""
echo "✨ 測試完成!"
