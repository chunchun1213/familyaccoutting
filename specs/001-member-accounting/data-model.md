# 資料模型:會員註冊與登入系統以及記帳主頁功能

**日期**: 2025-11-05  
**階段**: Phase 1 - 資料模型設計

## 概述

本文件定義所有實體(Entities)的結構、關聯、驗證規則和狀態轉換。所有資料模型遵循規格文件中定義的需求,並考慮效能、安全性和可維護性。

## 核心實體

### 1. User(使用者)

**用途**: 代表應用程式的註冊使用者

**資料表名稱**: `users`

**欄位定義**:

| 欄位名稱 | 型別 | 限制 | 說明 |
|---------|------|------|------|
| id | UUID | PRIMARY KEY, NOT NULL | 使用者唯一識別碼 |
| name | VARCHAR(100) | NOT NULL | 使用者姓名 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email 地址 |
| hashed_password | VARCHAR(255) | NOT NULL | bcrypt 雜湊後的密碼 |
| is_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Email 驗證狀態 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 建立時間(UTC) |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 最後更新時間(UTC) |

**索引**:
- `idx_users_email` ON (email) - 支援登入查詢
- `idx_users_created_at` ON (created_at) - 支援時間範圍查詢

**驗證規則**:
- name: 長度 1-100 字元,不可為空白
- email: 符合 RFC 5322 Email 格式,轉為小寫儲存
- hashed_password: bcrypt 雜湊,cost factor 12
- is_verified: 僅在完成 Email 驗證後設為 true

**狀態轉換**:
```
[新建] --註冊--> [未驗證] --驗證Email--> [已驗證]
```

**Dart 模型**:
```dart
class User {
  final String id;
  final String name;
  final String email;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime updatedAt;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.isVerified,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      isVerified: json['is_verified'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'is_verified': isVerified,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
```

### 2. VerificationCode(驗證碼)

**用途**: 用於 Email 驗證的一次性驗證碼

**儲存位置**: Supabase KV Store (快取) + PostgreSQL (備份)

**KV Store Key**: `verification:{email}`

**資料表名稱**: `verification_codes` (僅備份用途)

**欄位定義**:

| 欄位名稱 | 型別 | 限制 | 說明 |
|---------|------|------|------|
| id | UUID | PRIMARY KEY, NOT NULL | 驗證碼唯一識別碼 |
| email | VARCHAR(255) | NOT NULL | 目標 Email 地址 |
| code | CHAR(6) | NOT NULL | 6 位數驗證碼 |
| attempts | INTEGER | NOT NULL, DEFAULT 0 | 嘗試次數 |
| is_locked | BOOLEAN | NOT NULL, DEFAULT FALSE | 是否已鎖定(5 次錯誤) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 發送時間(UTC) |
| expires_at | TIMESTAMP | NOT NULL | 過期時間(創建時間 + 5 分鐘) |
| verified_at | TIMESTAMP | NULL | 驗證成功時間 |

**索引**:
- `idx_verification_codes_email` ON (email) - 支援查詢
- `idx_verification_codes_expires_at` ON (expires_at) - 支援清理過期資料

**驗證規則**:
- code: 恰好 6 位數字字元
- attempts: 0-5,超過 5 次設定 is_locked = true
- expires_at: created_at + 5 分鐘
- email: 必須符合 Email 格式

**狀態轉換**:
```
[新建] --發送--> [有效] --驗證成功--> [已使用]
                  |
                  +--過期--> [過期]
                  |
                  +--5次錯誤--> [已鎖定]
```

**生命週期**:
- 建立後 5 分鐘自動過期
- 驗證成功後標記 verified_at
- 重新發送前需檢查冷卻時間(60 秒)
- 每日清理過期記錄(超過 24 小時)

**Dart 模型**:
```dart
class VerificationCode {
  final String id;
  final String email;
  final String code;
  final int attempts;
  final bool isLocked;
  final DateTime createdAt;
  final DateTime expiresAt;
  final DateTime? verifiedAt;

  const VerificationCode({
    required this.id,
    required this.email,
    required this.code,
    required this.attempts,
    required this.isLocked,
    required this.createdAt,
    required this.expiresAt,
    this.verifiedAt,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);
  bool get isValid => !isExpired && !isLocked && verifiedAt == null;
  bool get canRetry => attempts < 5;

  factory VerificationCode.fromJson(Map<String, dynamic> json) {
    return VerificationCode(
      id: json['id'] as String,
      email: json['email'] as String,
      code: json['code'] as String,
      attempts: json['attempts'] as int,
      isLocked: json['is_locked'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      expiresAt: DateTime.parse(json['expires_at'] as String),
      verifiedAt: json['verified_at'] != null
          ? DateTime.parse(json['verified_at'] as String)
          : null,
    );
  }
}
```

### 3. Session(會話)

**用途**: 使用者的登入會話資訊,支援自動登入

**儲存位置**: 
- 後端: Supabase Auth (JWT)
- 前端: flutter_secure_storage (Token)

**JWT Payload 結構**:
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "iat": 1699200000,
  "exp": 1700409600
}
```

**資料表名稱**: `sessions` (追蹤多裝置登入)

**欄位定義**:

| 欄位名稱 | 型別 | 限制 | 說明 |
|---------|------|------|------|
| id | UUID | PRIMARY KEY, NOT NULL | 會話唯一識別碼 |
| user_id | UUID | NOT NULL, FK(users) | 關聯的使用者 ID |
| token_hash | VARCHAR(255) | NOT NULL, UNIQUE | Token 雜湊值(追蹤用) |
| device_info | JSONB | NULL | 裝置資訊(型號、OS 版本) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 建立時間(UTC) |
| expires_at | TIMESTAMP | NOT NULL | 過期時間(created_at + 7 天) |
| last_used_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 最後使用時間 |

**索引**:
- `idx_sessions_user_id` ON (user_id) - 支援查詢使用者的所有會話
- `idx_sessions_token_hash` ON (token_hash) - 支援 Token 驗證
- `idx_sessions_expires_at` ON (expires_at) - 支援清理過期會話

**驗證規則**:
- expires_at: created_at + 7 天
- 單一使用者最多 5 個有效會話,超過時刪除最舊的
- Token 雜湊使用 SHA-256

**狀態轉換**:
```
[新建] --登入--> [有效] --登出--> [已登出]
                  |
                  +--7天後--> [過期]
```

**生命週期**:
- 登入時建立新會話
- 每次 API 請求更新 last_used_at
- 登出時刪除會話
- 7 天後自動過期
- 每日清理過期會話

**Dart 模型**:
```dart
class Session {
  final String id;
  final String userId;
  final String token; // 僅在前端使用,不傳送到後端
  final DateTime createdAt;
  final DateTime expiresAt;
  final DateTime lastUsedAt;

  const Session({
    required this.id,
    required this.userId,
    required this.token,
    required this.createdAt,
    required this.expiresAt,
    required this.lastUsedAt,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);
  bool get isValid => !isExpired;

  factory Session.fromJson(Map<String, dynamic> json) {
    return Session(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      token: json['token'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      expiresAt: DateTime.parse(json['expires_at'] as String),
      lastUsedAt: DateTime.parse(json['last_used_at'] as String),
    );
  }
}
```

### 4. Transaction(交易記錄)

**用途**: 使用者的收支記錄

**資料表名稱**: `transactions`

**欄位定義**:

| 欄位名稱 | 型別 | 限制 | 說明 |
|---------|------|------|------|
| id | UUID | PRIMARY KEY, NOT NULL | 交易唯一識別碼 |
| user_id | UUID | NOT NULL, FK(users) | 關聯的使用者 ID |
| type | VARCHAR(10) | NOT NULL, CHECK IN ('income', 'expense') | 類型(收入/支出) |
| category | VARCHAR(50) | NOT NULL | 類別(餐飲、交通等) |
| amount | DECIMAL(12, 2) | NOT NULL, CHECK > 0, CHECK <= 1000000 | 金額(精度小數點後 2 位) |
| note | TEXT | NULL | 備註(選填) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 記錄時間(UTC) |
| synced_at | TIMESTAMP | NULL | 同步到伺服器時間(離線暫存用) |

**索引**:
- `idx_transactions_user_id` ON (user_id) - 支援查詢使用者的交易
- `idx_transactions_created_at` ON (created_at DESC) - 支援時間倒序查詢
- `idx_transactions_user_created` ON (user_id, created_at DESC) - 組合索引最佳化查詢

**驗證規則**:
- type: 僅允許 'income' 或 'expense'
- category: 
  - expense: 餐飲、交通、購物、娛樂、醫療、教育、其他
  - income: 薪資、獎金、投資、兼職、其他
- amount: 0.01 - 1,000,000.00
- note: 最大長度 500 字元

**狀態轉換**:
```
[本地暫存] --網路恢復--> [已同步]
[已同步] --刪除--> [軟刪除](保留 30 天)
```

**Row Level Security (RLS)**:
```sql
-- 使用者只能存取自己的交易記錄
CREATE POLICY "Users can only access own transactions"
ON transactions FOR ALL
USING (auth.uid() = user_id);
```

**Dart 模型**:
```dart
enum TransactionType { income, expense }

class Transaction {
  final String id;
  final String userId;
  final TransactionType type;
  final String category;
  final double amount;
  final String? note;
  final DateTime createdAt;
  final DateTime? syncedAt;

  const Transaction({
    required this.id,
    required this.userId,
    required this.type,
    required this.category,
    required this.amount,
    this.note,
    required this.createdAt,
    this.syncedAt,
  });

  bool get isSynced => syncedAt != null;

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      type: json['type'] == 'income' 
          ? TransactionType.income 
          : TransactionType.expense,
      category: json['category'] as String,
      amount: (json['amount'] as num).toDouble(),
      note: json['note'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      syncedAt: json['synced_at'] != null
          ? DateTime.parse(json['synced_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'type': type == TransactionType.income ? 'income' : 'expense',
      'category': category,
      'amount': amount,
      'note': note,
      'created_at': createdAt.toIso8601String(),
      'synced_at': syncedAt?.toIso8601String(),
    };
  }
}
```

## 關聯圖

```
User (1) ---(N) Transaction
  |
  +---(N) Session
  |
  +---(N) VerificationCode
```

**關聯說明**:
- 一個 User 可以有多個 Transaction
- 一個 User 可以有多個 Session(最多 5 個有效)
- 一個 User 可以有多個 VerificationCode(僅最新的有效)

## 聚合模型

### FinancialSummary(財務概覽)

**用途**: 計算使用者的總收入、總支出和結餘

**計算邏輯**:
```sql
SELECT 
  COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
  COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
  COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
FROM transactions
WHERE user_id = $1
```

**Dart 模型**:
```dart
class FinancialSummary {
  final double totalIncome;
  final double totalExpense;
  final double balance;

  const FinancialSummary({
    required this.totalIncome,
    required this.totalExpense,
    required this.balance,
  });

  factory FinancialSummary.fromJson(Map<String, dynamic> json) {
    return FinancialSummary(
      totalIncome: (json['total_income'] as num).toDouble(),
      totalExpense: (json['total_expense'] as num).toDouble(),
      balance: (json['balance'] as num).toDouble(),
    );
  }

  factory FinancialSummary.empty() {
    return const FinancialSummary(
      totalIncome: 0.0,
      totalExpense: 0.0,
      balance: 0.0,
    );
  }
}
```

## 資料庫遷移腳本

### 001_create_users.sql

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(name)) > 0),
  email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  hashed_password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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
```

### 002_create_verification_codes.sql

```sql
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
```

### 003_create_sessions.sql

```sql
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  device_info JSONB NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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
```

### 004_create_transactions.sql

```sql
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
```

## 資料驗證

所有資料驗證分為三層:

### 1. 前端驗證(Flutter)
- 即時表單驗證(使用者輸入時)
- 提供繁體中文錯誤訊息
- 防止無效資料提交到後端

### 2. 後端驗證(Edge Functions)
- 驗證所有 API 請求參數
- 防止繞過前端的惡意請求
- 使用 Zod 或 Joi 進行結構化驗證

### 3. 資料庫驗證(PostgreSQL)
- CHECK 約束確保資料完整性
- UNIQUE 約束防止重複資料
- FOREIGN KEY 約束維護關聯完整性
- Row Level Security 確保資料安全

## 效能考量

### 查詢優化
- 所有外鍵欄位建立索引
- 常用查詢建立組合索引
- 使用 EXPLAIN ANALYZE 分析慢查詢

### 快取策略
- 驗證碼使用 KV Store 快取(5 分鐘 TTL)
- Session Token 使用 KV Store 快取(7 天 TTL)
- 財務概覽計算結果快取(1 分鐘 TTL)

### 分頁策略
- 交易列表使用游標分頁(cursor-based pagination)
- 每頁 100 筆記錄
- 使用 created_at + id 作為游標

## 安全考量

### 敏感資料保護
- 密碼使用 bcrypt 雜湊,永不儲存明文
- JWT Token 簽署防止竄改
- Session Token 使用 SHA-256 雜湊儲存

### 存取控制
- Row Level Security 確保使用者只能存取自己的資料
- API 端點使用 JWT 驗證
- 前端使用 flutter_secure_storage 加密儲存 Token

### 資料完整性
- 使用資料庫交易確保原子性操作
- 外鍵約束防止孤立資料
- CHECK 約束防止無效資料
