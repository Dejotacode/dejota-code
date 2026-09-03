-- Etapa 5.37.1 / Fase 11 — hardening de autenticação e abuso de API.
CREATE TABLE IF NOT EXISTS security_rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  blocked_until INTEGER,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_blocked ON security_rate_limits(blocked_until);

-- A conta seed foi útil apenas no desenvolvimento inicial. Ela não deve permanecer ativa.
UPDATE users
SET active = 0, updated_at = datetime('now')
WHERE id = 'user-admin-seed';
