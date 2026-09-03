INSERT OR IGNORE INTO users (id, email, name, password_hash, password_salt, role, active, created_at, updated_at) VALUES
('user-admin-seed', 'admin@dejotacode.com', 'Admin Dejotacode', '9f7135bc7b246b3f8f3a2084ba711e3a1aee334e4f4d50a365c910eb3825ed6e', '6f4b4aac192e80b52efc9307a60877a5', 'owner', 1, datetime('now'), datetime('now'));
