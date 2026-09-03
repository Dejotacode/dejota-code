import type { Context } from 'hono';
import type { Env } from './types';
import { writeAudit } from './db';

export type SiteDeployReason = 'post_created'|'post_published'|'post_updated'|'post_unpublished'|'post_deleted'|'category_created'|'category_updated'|'category_deleted';

export function scheduleSiteDeploy(c: Context<{ Bindings: Env }>, reason: SiteDeployReason, metadata: Record<string, unknown> = {}): void {
  const hookUrl = c.env.PAGES_DEPLOY_HOOK_URL?.trim();
  if (!hookUrl) return;
  c.executionCtx.waitUntil((async () => {
    try {
      const response = await fetch(hookUrl, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({source:'dejotacode-cms',reason,...metadata}) });
      if (!response.ok) throw new Error(`deploy_hook_http_${response.status}`);
      await writeAudit(c.env,{actorUserId:typeof metadata.actorUserId==='string'?metadata.actorUserId:undefined,action:'site.deploy_requested',resourceType:'site',metadata:{reason,...metadata}});
    } catch (error) {
      await writeAudit(c.env,{actorUserId:typeof metadata.actorUserId==='string'?metadata.actorUserId:undefined,action:'site.deploy_failed',resourceType:'site',metadata:{reason,...metadata,error:error instanceof Error?error.message:'unknown_error'}});
    }
  })());
}
