export type Role = 'owner' | 'admin' | 'editor' | 'sales' | 'ops' | 'finance';
export type WorkflowStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'retrying' | 'cancelled' | 'needs_approval';

export interface Env {
  DB: D1Database;
  MEDIA?: R2Bucket;
  APP_ENV?: string;
  APP_URL?: string;
  SESSION_TTL_SECONDS?: string;
  PAGES_DEPLOY_HOOK_URL?: string;
  BOOTSTRAP_TOKEN?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
