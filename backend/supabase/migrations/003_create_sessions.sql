-- 003_create_sessions.sql
-- 建立會話資料表

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  device_info JSONB NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- 自動設定過期時間(7 天)
CREATE OR REPLACE FUNCTION set_session_expires()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at = NEW.created_at + INTERVAL '7 days';
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_session_expires_trigger
BEFORE INSERT ON sessions
FOR EACH ROW EXECUTE FUNCTION set_session_expires();

-- 限制單一使用者最多 5 個有效會話
CREATE OR REPLACE FUNCTION limit_user_sessions()
RETURNS TRIGGER AS $$
DECLARE
  session_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO session_count
  FROM sessions
  WHERE user_id = NEW.user_id AND expires_at > NOW();
  
  IF session_count >= 5 THEN
    DELETE FROM sessions
    WHERE id = (
      SELECT id FROM sessions
      WHERE user_id = NEW.user_id AND expires_at > NOW()
      ORDER BY last_used_at ASC
      LIMIT 1
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER limit_user_sessions_trigger
AFTER INSERT ON sessions
FOR EACH ROW EXECUTE FUNCTION limit_user_sessions();

-- Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
ON sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
ON sessions FOR DELETE
USING (auth.uid() = user_id);

COMMENT ON TABLE sessions IS '會話資料表 - 追蹤使用者登入會話';
COMMENT ON COLUMN sessions.id IS '會話唯一識別碼';
COMMENT ON COLUMN sessions.user_id IS '關聯的使用者 ID';
COMMENT ON COLUMN sessions.token_hash IS 'Token 雜湊值(SHA-256)';
COMMENT ON COLUMN sessions.device_info IS '裝置資訊(型號、OS 版本)';
COMMENT ON COLUMN sessions.created_at IS '建立時間(UTC)';
COMMENT ON COLUMN sessions.expires_at IS '過期時間(created_at + 7 天)';
COMMENT ON COLUMN sessions.last_used_at IS '最後使用時間';
