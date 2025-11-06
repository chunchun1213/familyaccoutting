-- 002_create_verification_codes.sql
-- 建立驗證碼資料表

CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  code CHAR(6) NOT NULL CHECK (code ~ '^\d{6}$'),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 5),
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP NULL
);

-- 建立索引
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_verification_codes_expires_at ON verification_codes(expires_at);

-- 自動設定過期時間(5 分鐘)
CREATE OR REPLACE FUNCTION set_verification_code_expires()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at = NEW.created_at + INTERVAL '5 minutes';
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_verification_code_expires_trigger
BEFORE INSERT ON verification_codes
FOR EACH ROW EXECUTE FUNCTION set_verification_code_expires();

-- 清理過期驗證碼(每日執行)
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_codes
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ language 'plpgsql';

COMMENT ON TABLE verification_codes IS '驗證碼資料表 - 儲存 Email 驗證碼';
COMMENT ON COLUMN verification_codes.id IS '驗證碼唯一識別碼';
COMMENT ON COLUMN verification_codes.email IS '目標 Email 地址';
COMMENT ON COLUMN verification_codes.code IS '6 位數驗證碼';
COMMENT ON COLUMN verification_codes.attempts IS '嘗試次數(最多 5 次)';
COMMENT ON COLUMN verification_codes.is_locked IS '是否已鎖定(5 次錯誤後)';
COMMENT ON COLUMN verification_codes.created_at IS '發送時間(UTC)';
COMMENT ON COLUMN verification_codes.expires_at IS '過期時間(創建時間 + 5 分鐘)';
COMMENT ON COLUMN verification_codes.verified_at IS '驗證成功時間';
