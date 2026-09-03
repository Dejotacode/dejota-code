import type { AuthUser, Env, Role } from './types';
import { randomId, randomToken, sha256, hashPassword, verifyPassword, normalizeEmail } from './security';

export async function createUser(env: Env, input: { email: string; name: string; password: string; role: Role }): Promise<AuthUser> {
  const id = randomId();
  const now = new Date().toISOString();
  const credentials = await hashPassword(input.password);
  await env.DB.prepare(`INSERT INTO users (id,email,name,password_hash,password_salt,role,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)`)
    .bind(id, normalizeEmail(input.email), input.name.trim().slice(0,120), credentials.hash, credentials.salt, input.role, now, now).run();
  return { id, email: normalizeEmail(input.email), name: input.name.trim().slice(0,120), role: input.role };
}

export async function authenticate(env: Env, email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
  const row = await env.DB.prepare(`SELECT id,email,name,password_hash,password_salt,role,active FROM users WHERE email = ? LIMIT 1`).bind(normalizeEmail(email)).first<any>();
  if (!row || !row.active || !(await verifyPassword(password, row.password_hash, row.password_salt))) return null;
  const token = randomToken();
  const tokenHash = await sha256(token);
  const ttl = Number(env.SESSION_TTL_SECONDS ?? 604800);
  const now = new Date();
  const expires = new Date(now.getTime() + ttl * 1000).toISOString();
  await env.DB.prepare(`INSERT INTO sessions (id,user_id,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)`).bind(randomId(), row.id, tokenHash, expires, now.toISOString()).run();
  return { user: { id: row.id, email: row.email, name: row.name, role: row.role }, token };
}

export async function getUserBySession(env: Env, token: string): Promise<AuthUser | null> {
  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(`SELECT u.id,u.email,u.name,u.role,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.revoked_at IS NULL AND u.active=1 LIMIT 1`).bind(tokenHash).first<any>();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await env.DB.prepare(`UPDATE sessions SET revoked_at=COALESCE(revoked_at,?) WHERE token_hash=?`).bind(new Date().toISOString(), tokenHash).run();
    return null;
  }
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export async function revokeSession(env: Env, token: string): Promise<void> {
  const tokenHash = await sha256(token);
  await env.DB.prepare(`UPDATE sessions SET revoked_at=? WHERE token_hash=?`).bind(new Date().toISOString(), tokenHash).run();
}

export async function writeAudit(env: Env, input: { actorUserId?: string; action: string; resourceType?: string; resourceId?: string; metadata?: unknown }): Promise<void> {
  await env.DB.prepare(`INSERT INTO audit_logs (id,actor_user_id,action,resource_type,resource_id,metadata_json,created_at) VALUES (?,?,?,?,?,?,?)`)
    .bind(randomId(), input.actorUserId ?? null, input.action, input.resourceType ?? null, input.resourceId ?? null, input.metadata ? JSON.stringify(input.metadata) : null, new Date().toISOString()).run();
}

export async function listUsers(env: Env) {
  const result = await env.DB.prepare(`SELECT id,email,name,role,active,created_at,updated_at FROM users ORDER BY created_at DESC`).all<any>();
  return result.results;
}

export async function setUserActive(env: Env, id: string, active: boolean): Promise<void> {
  await env.DB.prepare(`UPDATE users SET active=?, updated_at=? WHERE id=?`).bind(active ? 1 : 0, new Date().toISOString(), id).run();
}

export async function activeOwnerCount(env: Env): Promise<number> {
  const row = await env.DB.prepare(`SELECT COUNT(*) AS n FROM users WHERE role='owner' AND active=1`).first<any>();
  return Number(row?.n || 0);
}

export async function revokeAllUserSessions(env: Env, userId: string): Promise<void> {
  await env.DB.prepare(`UPDATE sessions SET revoked_at=COALESCE(revoked_at,?) WHERE user_id=? AND revoked_at IS NULL`).bind(new Date().toISOString(), userId).run();
}
