CREATE TABLE IF NOT EXISTS editorial_events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  post_id TEXT REFERENCES posts(id) ON DELETE SET NULL,
  session_id TEXT,
  visitor_id TEXT,
  path TEXT,
  referrer TEXT,
  progress INTEGER,
  duration_ms INTEGER,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_editorial_events_post_created ON editorial_events(post_id,created_at);
CREATE INDEX IF NOT EXISTS idx_editorial_events_visitor_created ON editorial_events(visitor_id,created_at);
CREATE INDEX IF NOT EXISTS idx_editorial_events_name_created ON editorial_events(event_name,created_at);
