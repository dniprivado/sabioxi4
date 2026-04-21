CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  status TEXT DEFAULT 'active', -- 'active' or 'blocked'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  questions TEXT NOT NULL, -- JSON string
  author_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_scores (
  user_id TEXT PRIMARY KEY,
  score INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
