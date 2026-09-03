import type { Env, AuthUser } from './types';
import { randomId } from './security';
import { writeAudit } from './db';
import { syncPostTags } from './editorial';

const POST_STATUSES = ['draft','review','published','archived'] as const;
type PostStatus = typeof POST_STATUSES[number];

export function slugify(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
}

export function sanitizeHtml(input: string): string {
  const allowedTags = new Set(['p','h2','h3','h4','ul','ol','li','blockquote','pre','code','strong','em','b','i','a','img','br','hr']);
  const commonAttrs = new Set(['title','class']);
  const attrsByTag: Record<string, Set<string>> = {
    a: new Set(['href','title','target','rel','class']),
    img: new Set(['src','alt','title','class']),
    code: new Set(['class','title']),
  };
  const safeUrl = (tag: string, name: string, value: string) => {
    const v=value.trim();
    if (!v) return '';
    if (v.startsWith('/') || v.startsWith('#')) return v;
    try {
      const u=new URL(v);
      if (u.protocol==='https:') return v;
      if (tag==='a' && name==='href' && u.protocol==='mailto:') return v;
    } catch {}
    return '';
  };
  const escapeAttr=(value:string)=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const withoutDangerousBlocks=input
    .replace(/<!--[\s\S]*?-->/g,'')
    .replace(/<(script|style|iframe|object|embed|template)[^>]*>[\s\S]*?<\/\1\s*>/gi,'')
    .replace(/<(script|style|iframe|object|embed|template)[^>]*\/?>/gi,'');
  return withoutDangerousBlocks.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g,(full,rawTag,rawAttrs)=>{
    const tag=String(rawTag).toLowerCase();
    if(!allowedTags.has(tag)) return '';
    if(full.startsWith('</')) return `</${tag}>`;
    const allowed=attrsByTag[tag] ?? commonAttrs;
    const out:string[]=[];
    const attrRe=/([a-zA-Z][a-zA-Z0-9:-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;
    let match:RegExpExecArray|null;
    while((match=attrRe.exec(String(rawAttrs||'')))){
      const name=match[1].toLowerCase();
      if(!allowed.has(name) && !commonAttrs.has(name)) continue;
      let value=match[2].replace(/^['"]|['"]$/g,'').trim();
      if(name==='href'||name==='src') { value=safeUrl(tag,name,value); if(!value) continue; }
      if(name==='target' && value!=='_blank' && value!=='_self') continue;
      if(name==='rel') value=value.split(/\s+/).filter(x=>['noopener','noreferrer','nofollow','ugc','sponsored'].includes(x)).join(' ');
      out.push(`${name}="${escapeAttr(value.slice(0,500))}"`);
    }
    if(tag==='a' && out.some(x=>x==='target="_blank"') && !out.some(x=>x.startsWith('rel='))) out.push('rel="noopener noreferrer"');
    const suffix=out.length?' '+out.join(' '):'';
    return `<${tag}${suffix}>`;
  });
}

function assertStatus(status: string): asserts status is PostStatus { if (!(POST_STATUSES as readonly string[]).includes(status)) throw new Error('invalid_status'); }

export async function listCategories(env: Env) { return (await env.DB.prepare(`SELECT id,name,slug,description,created_at,updated_at FROM categories ORDER BY name`).all<any>()).results; }
export async function createCategory(env: Env, actor: AuthUser, input: {name:string;slug?:string;description?:string}) {
  const id=randomId(), now=new Date().toISOString(), slug=slugify(input.slug||input.name);
  if (!input.name.trim() || !slug) throw new Error('invalid_category');
  await env.DB.prepare(`INSERT INTO categories(id,name,slug,description,created_at,updated_at) VALUES(?,?,?,?,?,?)`).bind(id,input.name.trim(),slug,input.description?.trim()||null,now,now).run();
  await writeAudit(env,{actorUserId:actor.id,action:'cms.category_created',resourceType:'category',resourceId:id,metadata:{name:input.name,slug}});
  return {id,name:input.name.trim(),slug,description:input.description?.trim()||null};
}
export async function updateCategory(env: Env, actor: AuthUser, id:string, input:{name?:string;slug?:string;description?:string}) {
  const row=await env.DB.prepare(`SELECT * FROM categories WHERE id=?`).bind(id).first<any>(); if(!row) throw new Error('category_not_found');
  const name=(input.name??row.name).trim(), slug=slugify(input.slug??row.slug); if(!name||!slug) throw new Error('invalid_category');
  await env.DB.prepare(`UPDATE categories SET name=?,slug=?,description=?,updated_at=? WHERE id=?`).bind(name,slug,input.description===undefined?row.description:input.description.trim()||null,new Date().toISOString(),id).run();
  await writeAudit(env,{actorUserId:actor.id,action:'cms.category_updated',resourceType:'category',resourceId:id,metadata:{name,slug}});
  return await env.DB.prepare(`SELECT id,name,slug,description,created_at,updated_at FROM categories WHERE id=?`).bind(id).first();
}
export async function deleteCategory(env: Env, actor: AuthUser, id:string) {
  const count=await env.DB.prepare(`SELECT COUNT(*) AS n FROM posts WHERE category_id=?`).bind(id).first<any>(); if(Number(count?.n||0)>0) throw new Error('category_in_use');
  const r=await env.DB.prepare(`DELETE FROM categories WHERE id=?`).bind(id).run(); if(!r.meta.changes) throw new Error('category_not_found');
  await writeAudit(env,{actorUserId:actor.id,action:'cms.category_deleted',resourceType:'category',resourceId:id});
}

export async function listPosts(env: Env, opts:{status?:string;categoryId?:string;search?:string;limit?:number;offset?:number;excludeId?:string;publicOnly?:boolean}={}) {
  const limit=Math.min(Math.max(Number(opts.limit||50),1),100), offset=Math.max(Number(opts.offset||0),0);
  const where:string[]=[]; const binds:any[]=[];
  if(opts.status){assertStatus(opts.status);where.push('p.status=?');binds.push(opts.status)}
  if(opts.publicOnly){where.push(`(p.published_at IS NULL OR julianday(p.published_at) <= julianday('now'))`)}
  if(opts.categoryId){where.push('p.category_id=?');binds.push(opts.categoryId)}
  if(opts.search){where.push('(p.title LIKE ? OR p.excerpt LIKE ? OR p.content_html LIKE ?)');const q=`%${opts.search}%`;binds.push(q,q,q)}
  if(opts.excludeId){where.push('p.id<>?');binds.push(opts.excludeId)}
  const sql=`SELECT p.id,p.title,p.slug,p.excerpt,p.featured_image,p.author_user_id,p.category_id,p.status,p.published_at,p.seo_title,p.seo_description,p.canonical_url,p.og_image,p.robots,p.schema_json,p.focus_keyword,p.content_type,p.cluster_slug,p.primary_keyword,p.search_intent,p.seo_priority,p.reviewed_at,p.reviewed_by,p.sources_json,p.experience_note,p.featured,p.reading_time,p.created_at,p.updated_at,c.name category_name,c.slug category_slug,u.name author_name FROM posts p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY COALESCE(p.published_at,p.updated_at) DESC LIMIT ? OFFSET ?`;
  return (await env.DB.prepare(sql).bind(...binds,limit,offset).all<any>()).results;
}
export async function getPost(env: Env,id:string){return await env.DB.prepare(`SELECT p.*,c.name category_name,c.slug category_slug,u.name author_name FROM posts p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id WHERE p.id=?`).bind(id).first<any>()}
export async function getPublishedBySlug(env: Env,slug:string){return await env.DB.prepare(`SELECT p.*,c.name category_name,c.slug category_slug,u.name author_name FROM posts p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id WHERE p.slug=? AND p.status='published' AND (p.published_at IS NULL OR julianday(p.published_at)<=julianday('now')) LIMIT 1`).bind(slug).first<any>()}

function normalizeInput(input:any){
  const title=String(input.title||'').trim(), slug=slugify(String(input.slug||title)), excerpt=String(input.excerpt||'').trim().slice(0,500), content=sanitizeHtml(String(input.content_html||''));
  const categoryId=String(input.category_id||''), status=String(input.status||'draft'); assertStatus(status);
  if(!title||!slug||!categoryId||!content) throw new Error('title_slug_category_content_required');
  const contentType=String(input.content_type||'supporting'); if(!['pillar','cluster','supporting'].includes(contentType)) throw new Error('invalid_content_type'); const searchIntent=String(input.search_intent||'informacional'); if(!['informacional','comercial','navegacional','transacional'].includes(searchIntent)) throw new Error('invalid_search_intent'); const seoPriority=String(input.seo_priority||'media'); if(!['alta','media','baixa'].includes(seoPriority)) throw new Error('invalid_seo_priority'); const sources=Array.isArray(input.sources)?input.sources.map(String).filter(Boolean).slice(0,20):[]; return {title,slug,excerpt,content,categoryId,status,publishedAt:input.published_at?new Date(String(input.published_at)).toISOString():null,featuredImage:String(input.featured_image||'').trim()||null,seoTitle:String(input.seo_title||'').trim().slice(0,160)||null,seoDescription:String(input.seo_description||'').trim().slice(0,320)||null,canonicalUrl:String(input.canonical_url||'').trim()||null,ogImage:String(input.og_image||'').trim()||null,robots:String(input.robots||'index,follow').trim().slice(0,100),schemaJson:input.schema_json?JSON.stringify(input.schema_json):null,focusKeyword:String(input.focus_keyword||'').trim().slice(0,120)||null,contentType,clusterSlug:slugify(String(input.cluster_slug||'geral'))||'geral',primaryKeyword:String(input.primary_keyword||input.focus_keyword||'').trim().slice(0,120)||null,searchIntent,seoPriority,reviewedAt:input.reviewed_at?new Date(String(input.reviewed_at)).toISOString():null,reviewedBy:String(input.reviewed_by||'').trim().slice(0,160)||null,sourcesJson:JSON.stringify(sources),experienceNote:String(input.experience_note||'').trim().slice(0,1000)||null,featured:input.featured?1:0,readingTime:Math.min(Math.max(Number(input.reading_time||5),1),120)};
}
export async function createPost(env: Env, actor: AuthUser, input:any){
  const v=normalizeInput(input), exists=await env.DB.prepare(`SELECT id FROM categories WHERE id=?`).bind(v.categoryId).first(); if(!exists) throw new Error('category_not_found');
  const id=randomId(),now=new Date().toISOString();
  await env.DB.prepare(`INSERT INTO posts(id,title,slug,excerpt,content_html,featured_image,author_user_id,category_id,status,published_at,seo_title,seo_description,canonical_url,og_image,robots,schema_json,focus_keyword,content_type,cluster_slug,primary_keyword,search_intent,seo_priority,reviewed_at,reviewed_by,sources_json,experience_note,featured,reading_time,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,v.title,v.slug,v.excerpt,v.content,v.featuredImage,actor.id,v.categoryId,v.status,v.publishedAt,v.seoTitle,v.seoDescription,v.canonicalUrl,v.ogImage,v.robots,v.schemaJson,v.focusKeyword,v.contentType,v.clusterSlug,v.primaryKeyword,v.searchIntent,v.seoPriority,v.reviewedAt,v.reviewedBy,v.sourcesJson,v.experienceNote,v.featured,v.readingTime,now,now).run();
  await writeAudit(env,{actorUserId:actor.id,action:'cms.post_created',resourceType:'post',resourceId:id,metadata:{status:v.status,slug:v.slug}}); await syncPostTags(env, actor, id, input.tags); return getPost(env,id);
}
export async function updatePost(env: Env, actor: AuthUser,id:string,input:any){
  const old=await getPost(env,id); if(!old) throw new Error('post_not_found'); const v=normalizeInput(input), exists=await env.DB.prepare(`SELECT id FROM categories WHERE id=?`).bind(v.categoryId).first(); if(!exists) throw new Error('category_not_found');
  await env.DB.prepare(`UPDATE posts SET title=?,slug=?,excerpt=?,content_html=?,featured_image=?,category_id=?,status=?,published_at=?,seo_title=?,seo_description=?,canonical_url=?,og_image=?,robots=?,schema_json=?,focus_keyword=?,content_type=?,cluster_slug=?,primary_keyword=?,search_intent=?,seo_priority=?,reviewed_at=?,reviewed_by=?,sources_json=?,experience_note=?,featured=?,reading_time=?,updated_at=? WHERE id=?`).bind(v.title,v.slug,v.excerpt,v.content,v.featuredImage,v.categoryId,v.status,v.publishedAt,v.seoTitle,v.seoDescription,v.canonicalUrl,v.ogImage,v.robots,v.schemaJson,v.focusKeyword,v.contentType,v.clusterSlug,v.primaryKeyword,v.searchIntent,v.seoPriority,v.reviewedAt,v.reviewedBy,v.sourcesJson,v.experienceNote,v.featured,v.readingTime,new Date().toISOString(),id).run();
  await writeAudit(env,{actorUserId:actor.id,action:'cms.post_updated',resourceType:'post',resourceId:id,metadata:{fromStatus:old.status,toStatus:v.status,slug:v.slug}}); await syncPostTags(env, actor, id, input.tags); return getPost(env,id);
}
export async function deletePost(env: Env, actor: AuthUser,id:string){const old=await getPost(env,id);if(!old)throw new Error('post_not_found');const r=await env.DB.prepare(`DELETE FROM posts WHERE id=?`).bind(id).run();if(!r.meta.changes)throw new Error('post_not_found');await writeAudit(env,{actorUserId:actor.id,action:'cms.post_deleted',resourceType:'post',resourceId:id,metadata:{status:old.status,slug:old.slug}});return old;}
