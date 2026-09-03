import type { Env } from './types';
import { normalizeEmail, randomId } from './security';

function clean(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160;
}

export async function createPublicLead(env: Env, input: any) {
  const name = clean(input.name, 120);
  const email = normalizeEmail(clean(input.email, 160));
  const company = clean(input.company, 160) || null;
  const service = clean(input.service, 120);
  const objective = clean(input.objective, 4000);
  const timeline = clean(input.timeline, 240) || null;
  const budget = clean(input.budget, 120) || null;
  const source = clean(input.source || '/briefing/', 240) || '/briefing/';
  if (!name || !validEmail(email) || !service || !objective) throw new Error('invalid_briefing');
  const id = randomId();
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO public_leads(id,name,email,company,service,objective,timeline,budget,source,status,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,'new',?,?)`)
    .bind(id,name,email,company,service,objective,timeline,budget,source,now,now).run();
  return { id, status: 'received' };
}

export async function createPublicFeedback(env: Env, input: any) {
  const name = clean(input.name, 120);
  const email = normalizeEmail(clean(input.email, 160));
  const project = clean(input.project, 200);
  const score = Number(input.score);
  const message = clean(input.message, 4000);
  const source = clean(input.source || '/feedback/', 240) || '/feedback/';
  if (!name || !validEmail(email) || !project || !Number.isInteger(score) || score < 1 || score > 5 || !message) throw new Error('invalid_feedback');
  const id = randomId();
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO public_feedback(id,name,email,project,score,message,source,status,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?,'new',?,?)`)
    .bind(id,name,email,project,score,message,source,now,now).run();
  return { id, status: 'received' };
}
