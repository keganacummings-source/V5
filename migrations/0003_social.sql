CREATE TABLE IF NOT EXISTS turbz_profiles (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS turbz_chat (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  channel TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS turbz_chat_channel_idx ON turbz_chat (channel, id DESC);

CREATE TABLE IF NOT EXISTS turbz_friends (
  requester TEXT NOT NULL,
  target TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (requester, target)
);

CREATE TABLE IF NOT EXISTS turbz_graves (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  mode TEXT NOT NULL,
  score INTEGER NOT NULL,
  name TEXT NOT NULL,
  race TEXT NOT NULL,
  level INTEGER NOT NULL,
  payload TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS turbz_graves_mode_score_idx ON turbz_graves (mode, score DESC, id DESC);
