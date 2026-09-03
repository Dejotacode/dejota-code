CREATE TABLE IF NOT EXISTS public_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service TEXT NOT NULL,
  objective TEXT NOT NULL,
  timeline TEXT,
  budget TEXT,
  source TEXT NOT NULL DEFAULT '/briefing/',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','won','lost','spam')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_public_leads_status_created ON public_leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_leads_email ON public_leads(email);

CREATE TABLE IF NOT EXISTS public_feedback (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '/feedback/',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','archived','spam')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_public_feedback_status_created ON public_feedback(status, created_at DESC);
