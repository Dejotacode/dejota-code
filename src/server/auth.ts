import type { Context } from 'hono';
import type { Env, Role, AuthUser } from './types';
import { authenticate, createUser, getUserBySession, revokeSession, writeAudit } from './db';

export const COOKIE_NAME = 'dejota_session';

function cookieOptions(maxAge: number): string {
  return `${COOKIE_NAME}=TOKEN; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}${maxAge === 0 ? '; Expires=Thu, 01 Jan 1970 00:00:00 GMT' : ''}`;
}

export function readSessionCookie(c: Context): string | null {
  const raw = c.req.header('Cookie') ?? '';
  const match = raw.split(';').map((v) => v.trim()).find((v) => v.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.slice(COOKIE_NAME.length + 1)) : null;
}

export async function requireUser(c: Context<{ Bindings: Env }>): Promise<AuthUser | null> {
  const token = readSessionCookie(c);
  if (!token) return null;
  return getUserBySession(c.env, token);
}

export function requireRole(user: AuthUser, roles: Role[]): boolean {
  return roles.includes(user.role);
}

export async function login(c: Context<{ Bindings: Env }>, email: string, password: string) {
  const result = await authenticate(c.env, email, password);
  if (!result) return null;
  const ttl = Number(c.env.SESSION_TTL_SECONDS ?? 604800);
  c.header('Set-Cookie', cookieOptions(ttl).replace('TOKEN', encodeURIComponent(result.token)));
  await writeAudit(c.env, { actorUserId: result.user.id, action: 'auth.login' });
  return result.user;
}

export async function logout(c: Context<{ Bindings: Env }>): Promise<void> {
  const token = readSessionCookie(c);
  if (token) await revokeSession(c.env, token);
  c.header('Set-Cookie', cookieOptions(0).replace('TOKEN', ''));
}

export { createUser };
