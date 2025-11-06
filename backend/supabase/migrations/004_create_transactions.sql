-- 004_create_transactions.sql
-- 建立交易記錄資料表

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0 AND amount <= 1000000),
  note TEXT NULL CHECK (LENGTH(note) <= 500),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  synced_at TIMESTAMP NULL
);

-- 建立索引
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at DESC);

-- Row Level Security
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

COMMENT ON TABLE transactions IS '交易記錄資料表 - 儲存使用者的收支記錄';
COMMENT ON COLUMN transactions.id IS '交易唯一識別碼';
COMMENT ON COLUMN transactions.user_id IS '關聯的使用者 ID';
COMMENT ON COLUMN transactions.type IS '類型: income(收入) 或 expense(支出)';
COMMENT ON COLUMN transactions.category IS '類別(餐飲、交通、薪資等)';
COMMENT ON COLUMN transactions.amount IS '金額(精度小數點後 2 位,最大 1,000,000)';
COMMENT ON COLUMN transactions.note IS '備註(選填,最大 500 字元)';
COMMENT ON COLUMN transactions.created_at IS '記錄時間(UTC)';
COMMENT ON COLUMN transactions.synced_at IS '同步到伺服器時間(離線暫存用)';
