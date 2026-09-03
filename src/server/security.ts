const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export function randomId(): string {
  return crypto.randomUUID();
}

export function randomToken(bytes = 32): string {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return bytesToHex(data);
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function hashPassword(password: string, saltHex?: string): Promise<{ hash: string; salt: string }> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations: 210_000, hash: 'SHA-256' }, baseKey, 256);
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const candidate = await hashPassword(password, salt);
  return candidate.hash === hash;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase().slice(0, 160);
}

export function validPassword(value: string): boolean {
  return value.length >= 12 && value.length <= 128;
}

export function constantTimeEqual(a: string, b: string): boolean {
  const aa = encoder.encode(a);
  const bb = encoder.encode(b);
  const len = Math.max(aa.length, bb.length);
  let diff = aa.length ^ bb.length;
  for (let i = 0; i < len; i++) diff |= (aa[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

export async function consumeRateLimit(
  db: D1Database,
  key: string,
  options: { limit: number; windowSeconds: number; blockSeconds: number }
): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = Math.floor(Date.now() / 1000);
  const row = await db.prepare(`SELECT window_started_at,attempts,blocked_until FROM security_rate_limits WHERE key=?`).bind(key).first<any>();
  if (row?.blocked_until && Number(row.blocked_until) > now) {
    return { allowed: false, retryAfter: Number(row.blocked_until) - now };
  }

  const windowStart = Number(row?.window_started_at || 0);
  const expired = !row || now - windowStart >= options.windowSeconds;
  const attempts = expired ? 1 : Number(row.attempts || 0) + 1;
  const startedAt = expired ? now : windowStart;
  const blockedUntil = attempts > options.limit ? now + options.blockSeconds : null;

  await db.prepare(`INSERT INTO security_rate_limits(key,window_started_at,attempts,blocked_until,updated_at)
    VALUES(?,?,?,?,?)
    ON CONFLICT(key) DO UPDATE SET window_started_at=excluded.window_started_at,attempts=excluded.attempts,blocked_until=excluded.blocked_until,updated_at=excluded.updated_at`)
    .bind(key, startedAt, attempts, blockedUntil, new Date().toISOString()).run();

  return blockedUntil
    ? { allowed: false, retryAfter: options.blockSeconds }
    : { allowed: true, retryAfter: 0 };
}

export async function clearRateLimit(db: D1Database, key: string): Promise<void> {
  await db.prepare(`DELETE FROM security_rate_limits WHERE key=?`).bind(key).run();
}
