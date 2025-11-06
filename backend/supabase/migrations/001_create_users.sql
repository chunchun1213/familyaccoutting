-- 001_create_users.sql
-- 建立使用者資料表

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(name)) > 0),
  email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  hashed_password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);

COMMENT ON TABLE users IS '使用者資料表 - 儲存註冊使用者的基本資訊';
COMMENT ON COLUMN users.id IS '使用者唯一識別碼';
COMMENT ON COLUMN users.name IS '使用者姓名';
COMMENT ON COLUMN users.email IS 'Email 地址(唯一)';
COMMENT ON COLUMN users.hashed_password IS 'bcrypt 雜湊後的密碼';
COMMENT ON COLUMN users.is_verified IS 'Email 驗證狀態';
COMMENT ON COLUMN users.created_at IS '建立時間(UTC)';
COMMENT ON COLUMN users.updated_at IS '最後更新時間(UTC)';
