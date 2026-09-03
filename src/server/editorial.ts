import type { Env, AuthUser } from './types';
import { randomId } from './security';
import { writeAudit } from './db';
function slugify(value: string): string { return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120); }

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMMENT_STATUSES = ['pending','approved','spam','rejected'] as const;

export async function listTags(env: Env) {
  return (await env.DB.prepare(`SELECT id,name,slug,created_at,updated_at FROM tags ORDER BY name`).all<any>()).results;
}
export async function listPublicTags(env: Env) {
  return (await env.DB.prepare(`SELECT DISTINCT t.id,t.name,t.slug FROM tags t JOIN post_tags pt ON pt.tag_id=t.id JOIN posts p ON p.id=pt.post_id WHERE p.status='published' AND (p.published_at IS NULL OR p.published_at<=datetime('now')) ORDER BY t.name`).all<any>()).results;
}

export async function getPostTags(env: Env, postId: string) {
  return (await env.DB.prepare(`SELECT t.id,t.name,t.slug FROM tags t JOIN post_tags pt ON pt.tag_id=t.id WHERE pt.post_id=? ORDER BY t.name`).bind(postId).all<any>()).results;
}

export async function syncPostTags(env: Env, actor: AuthUser, postId: string, rawTags: unknown) {
  const names = Array.isArray(rawTags) ? rawTags.map(String) : [];
  const unique = [...new Map(names.map((name) => [slugify(name), name.trim().slice(0,60)])).entries()]
    .filter(([slug,name]) => Boolean(slug && name))
    .slice(0,10);
  await env.DB.prepare(`DELETE FROM post_tags WHERE post_id=?`).bind(postId).run();
  for (const [slug,name] of unique) {
    const existing = await env.DB.prepare(`SELECT id FROM tags WHERE slug=?`).bind(slug).first<any>();
    const tagId = existing?.id || randomId();
    if (!existing) {
      const now = new Date().toISOString();
      await env.DB.prepare(`INSERT INTO tags(id,name,slug,created_at,updated_at) VALUES(?,?,?,?,?)`).bind(tagId,name,slug,now,now).run();
    }
    await env.DB.prepare(`INSERT OR IGNORE INTO post_tags(post_id,tag_id) VALUES(?,?)`).bind(postId,tagId).run();
  }
  await writeAudit(env,{actorUserId:actor.id,action:'cms.post_tags_synced',resourceType:'post',resourceId:postId,metadata:{count:unique.length}});
  return getPostTags(env,postId);
}

export async function getAuthor(env: Env, userId: string) {
  return await env.DB.prepare(`SELECT id,name,email,role FROM users WHERE id=? AND active=1`).bind(userId).first<any>();
}

export async function listAuthorPosts(env: Env, userId: string, limit=12, offset=0) {
  return (await env.DB.prepare(`SELECT p.id,p.title,p.slug,p.excerpt,p.featured_image,p.published_at,p.updated_at,c.name category_name,c.slug category_slug,u.name author_name FROM posts p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id WHERE p.author_user_id=? AND p.status='published' AND (p.published_at IS NULL OR p.published_at<=datetime('now')) ORDER BY COALESCE(p.published_at,p.updated_at) DESC LIMIT ? OFFSET ?`).bind(userId,Math.min(Math.max(limit,1),50),Math.max(offset,0)).all<any>()).results;
}

export async function listTagPosts(env: Env, tagSlug: string, limit=12, offset=0) {
  return (await env.DB.prepare(`SELECT p.id,p.title,p.slug,p.excerpt,p.featured_image,p.published_at,p.updated_at,c.name category_name,c.slug category_slug,u.name author_name FROM posts p JOIN post_tags pt ON pt.post_id=p.id JOIN tags t ON t.id=pt.tag_id JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id WHERE t.slug=? AND p.status='published' AND (p.published_at IS NULL OR p.published_at<=datetime('now')) ORDER BY COALESCE(p.published_at,p.updated_at) DESC LIMIT ? OFFSET ?`).bind(tagSlug,Math.min(Math.max(limit,1),50),Math.max(offset,0)).all<any>()).results;
}

export async function getTag(env: Env, slug: string) { return await env.DB.prepare(`SELECT id,name,slug FROM tags WHERE slug=?`).bind(slug).first<any>(); }

export async function recommendedPosts(env: Env, postId: string, categoryId: string, limit=4) {
  const candidates = (await env.DB.prepare(`SELECT p.id,p.title,p.slug,p.excerpt,p.featured_image,p.published_at,p.updated_at,c.name category_name,c.slug category_slug,u.name author_name, CASE WHEN p.category_id=? THEN 5 ELSE 0 END AS category_score FROM posts p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id WHERE p.id<>? AND p.status='published' AND (p.published_at IS NULL OR p.published_at<=datetime('now')) ORDER BY category_score DESC, COALESCE(p.published_at,p.updated_at) DESC LIMIT 30`).bind(categoryId,postId).all<any>()).results as any[];
  const currentTags = (await getPostTags(env,postId)).map((x:any)=>x.id);
  if (!currentTags.length) return candidates.slice(0,limit);
  const scores = await Promise.all(candidates.map(async (p:any) => {
    const rows = await env.DB.prepare(`SELECT tag_id FROM post_tags WHERE post_id=?`).bind(p.id).all<any>();
    const overlap = rows.results.filter((x:any)=>currentTags.includes(x.tag_id)).length;
    return {...p,recommendation_score:Number(p.category_score||0)+overlap*3};
  }));
  return scores.sort((a,b)=>b.recommendation_score-a.recommendation_score).slice(0,limit);
}

export async function listApprovedComments(env: Env, postId: string) {
  return (await env.DB.prepare(`SELECT id,name,body,created_at FROM comments WHERE post_id=? AND status='approved' ORDER BY created_at ASC LIMIT 100`).bind(postId).all<any>()).results;
}

export async function createComment(env: Env, input: {postId:string;name:string;email?:string;body:string;ipHash?:string;userAgent?:string;honeypot?:string}) {
  if(input.honeypot) throw new Error('spam_rejected');
  const name=input.name.trim().slice(0,80), body=input.body.trim().slice(0,2000), email=(input.email||'').trim().toLowerCase().slice(0,160);
  if(!name || body.length<3) throw new Error('name_and_comment_required');
  if(email && !emailRe.test(email)) throw new Error('invalid_email');
  const post=await env.DB.prepare(`SELECT id FROM posts WHERE id=? AND status='published'`).bind(input.postId).first(); if(!post) throw new Error('post_not_found');
  if(input.ipHash){ const recent=await env.DB.prepare(`SELECT COUNT(*) AS n FROM comments WHERE ip_hash=? AND created_at>=datetime('now','-10 minutes')`).bind(input.ipHash).first<any>(); if(Number(recent?.n||0)>=3) throw new Error('comment_rate_limited'); }
  const now=new Date().toISOString(), id=randomId();
  await env.DB.prepare(`INSERT INTO comments(id,post_id,name,email,body,status,ip_hash,user_agent,created_at,updated_at) VALUES(?,?,?,?,?,'pending',?,?,?,?)`).bind(id,input.postId,name,email||null,body,input.ipHash||null,(input.userAgent||'').slice(0,300)||null,now,now).run();
  return {id,status:'pending'};
}

export async function listComments(env: Env, status?: string) {
  const s=status && COMMENT_STATUSES.includes(status as any) ? status : undefined;
  return (await env.DB.prepare(`SELECT c.id,c.post_id,c.name,c.email,c.body,c.status,c.created_at,p.title post_title,p.slug post_slug FROM comments c JOIN posts p ON p.id=c.post_id ${s?'WHERE c.status=?':''} ORDER BY c.created_at DESC LIMIT 200`).bind(...(s?[s]:[])).all<any>()).results;
}

export async function moderateComment(env: Env, actor: AuthUser, id: string, status: string) {
  if(!COMMENT_STATUSES.includes(status as any)) throw new Error('invalid_comment_status');
  const now=new Date().toISOString(); const r=await env.DB.prepare(`UPDATE comments SET status=?,updated_at=? WHERE id=?`).bind(status,now,id).run(); if(!r.meta.changes) throw new Error('comment_not_found');
  await writeAudit(env,{actorUserId:actor.id,action:'editorial.comment_moderated',resourceType:'comment',resourceId:id,metadata:{status}});
}

export async function subscribeNewsletter(env: Env, emailRaw: string, source='blog') {
  const email=emailRaw.trim().toLowerCase().slice(0,160); if(!emailRe.test(email)) throw new Error('invalid_email');
  const now=new Date().toISOString();
  await env.DB.prepare(`INSERT INTO newsletter_subscribers(id,email,status,source,consent_at,created_at,updated_at) VALUES(?,?,'subscribed',?,?,?,?) ON CONFLICT(email) DO UPDATE SET status='subscribed',source=excluded.source,consent_at=excluded.consent_at,updated_at=excluded.updated_at`).bind(randomId(),email,source.slice(0,80),now,now,now).run();
  return {email,status:'subscribed'};
}

export async function listNewsletterSubscribers(env: Env) {
  return (await env.DB.prepare(`SELECT id,email,status,source,consent_at,created_at,updated_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 500`).all<any>()).results;
}
