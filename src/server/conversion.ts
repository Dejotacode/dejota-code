import type { Env, AuthUser } from './types';
import { randomId, sha256 } from './security';
import { writeAudit } from './db';
import { subscribeNewsletter } from './editorial';

const slugify=(v:string)=>v.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));

export async function listInterests(env:Env){return (await env.DB.prepare(`SELECT id,name,slug,active FROM newsletter_interests WHERE active=1 ORDER BY name`).all<any>()).results;}
export async function getLeadMagnets(env:Env){return (await env.DB.prepare(`SELECT id,title,slug,description,category_slug,file_url,cta_label,active FROM lead_magnets WHERE active=1 ORDER BY title`).all<any>()).results;}
export async function getLeadMagnet(env:Env,slug:string){return await env.DB.prepare(`SELECT id,title,slug,description,category_slug,file_url,cta_label,active FROM lead_magnets WHERE slug=? AND active=1`).bind(slug).first<any>();}
export async function getLeadMagnetByCategory(env:Env,categorySlug:string){return await env.DB.prepare(`SELECT id,title,slug,description,category_slug,file_url,cta_label,active FROM lead_magnets WHERE active=1 AND category_slug=? ORDER BY updated_at DESC LIMIT 1`).bind(categorySlug).first<any>();}

export async function getDynamicCTA(env:Env,postId:string,categoryId:string,categorySlug:string){
  const exact=await env.DB.prepare(`SELECT c.id,c.title,c.description,c.button_text,c.destination,c.priority,c.magnet_id,m.slug magnet_slug,m.title magnet_title,m.file_url magnet_file_url FROM content_ctas c LEFT JOIN lead_magnets m ON m.id=c.magnet_id AND m.active=1 WHERE c.active=1 AND c.post_id=? ORDER BY c.priority DESC,c.updated_at DESC LIMIT 1`).bind(postId).first<any>();
  if(exact)return exact;
  const cat=await env.DB.prepare(`SELECT c.id,c.title,c.description,c.button_text,c.destination,c.priority,c.magnet_id,m.slug magnet_slug,m.title magnet_title,m.file_url magnet_file_url FROM content_ctas c LEFT JOIN lead_magnets m ON m.id=c.magnet_id AND m.active=1 WHERE c.active=1 AND c.category_id=? ORDER BY c.priority DESC,c.updated_at DESC LIMIT 1`).bind(categoryId).first<any>();
  if(cat)return cat;
  const magnet=await getLeadMagnetByCategory(env,categorySlug);
  if(magnet)return {id:`auto-${magnet.id}`,title:magnet.title,description:magnet.description,button_text:magnet.cta_label,destination:'lead_magnet',priority:0,magnet_id:magnet.id,magnet_slug:magnet.slug,magnet_title:magnet.title,magnet_file_url:magnet.file_url};
  return {id:'fallback-newsletter',title:'Receba os próximos tutoriais',description:'Conteúdo prático e direto para aprender, aplicar e construir sua renda online.',button_text:'Quero receber',destination:'newsletter',priority:-1,magnet_id:null,magnet_slug:null,magnet_title:null,magnet_file_url:null};
}

export async function subscribeWithInterests(env:Env,email:string,source:string,interests:string[]){
  const result=await subscribeNewsletter(env,email,source);
  const row=await env.DB.prepare(`SELECT id FROM newsletter_subscribers WHERE email=?`).bind(email.trim().toLowerCase()).first<any>();
  if(!row) throw new Error('subscriber_not_found');
  await env.DB.prepare(`DELETE FROM subscriber_interests WHERE subscriber_id=?`).bind(row.id).run();
  const unique=[...new Set((interests||[]).map(String).map(x=>x.trim()).filter(Boolean))].slice(0,8);
  for(const slug of unique){const i=await env.DB.prepare(`SELECT id FROM newsletter_interests WHERE slug=? AND active=1`).bind(slug).first<any>();if(i)await env.DB.prepare(`INSERT OR IGNORE INTO subscriber_interests(subscriber_id,interest_id,created_at) VALUES(?,?,?)`).bind(row.id,i.id,new Date().toISOString()).run();}
  return {...result,interests:unique};
}

export async function recordConversionEvent(env:Env,input:{eventName:string;postId?:string;visitorId?:string;sessionId?:string;path?:string;metadata?:unknown}){
  const allowed=['cta_impression','cta_click','lead_magnet_view','lead_magnet_download','newsletter_interest_selected','lead_capture','content_conversion'];
  if(!allowed.includes(input.eventName))throw new Error('invalid_conversion_event');
  const vid=input.visitorId?await sha256(input.visitorId.slice(0,160)):null;
  await env.DB.prepare(`INSERT INTO editorial_events(id,event_name,post_id,session_id,visitor_id,path,metadata_json,created_at) VALUES(?,?,?,?,?,?,?,?)`).bind(randomId(),input.eventName,input.postId||null,input.sessionId||null,vid,(input.path||'').slice(0,500)||null,input.metadata?JSON.stringify(input.metadata):null,new Date().toISOString()).run();
}

export async function conversionDashboard(env:Env,days=30){
 const d=clamp(Math.floor(days||30),1,365);const since=new Date(Date.now()-d*86400000).toISOString();
 const summary=await env.DB.prepare(`SELECT COUNT(CASE WHEN event_name='cta_impression' THEN 1 END) cta_impressions,COUNT(CASE WHEN event_name='cta_click' THEN 1 END) cta_clicks,COUNT(CASE WHEN event_name='lead_magnet_download' THEN 1 END) magnet_downloads,COUNT(CASE WHEN event_name='newsletter_interest_selected' THEN 1 END) interest_selections,COUNT(CASE WHEN event_name='lead_capture' THEN 1 END) leads,COUNT(CASE WHEN event_name='content_conversion' THEN 1 END) conversions FROM editorial_events WHERE created_at>=?`).bind(since).first<any>();
 const byContent=await env.DB.prepare(`SELECT p.id,p.title,p.slug,COUNT(CASE WHEN e.event_name='cta_impression' THEN 1 END) impressions,COUNT(CASE WHEN e.event_name='cta_click' THEN 1 END) clicks,COUNT(CASE WHEN e.event_name='lead_capture' THEN 1 END) leads,COUNT(CASE WHEN e.event_name='content_conversion' THEN 1 END) conversions FROM editorial_events e JOIN posts p ON p.id=e.post_id WHERE e.created_at>=? GROUP BY p.id ORDER BY conversions DESC,leads DESC,clicks DESC LIMIT 20`).bind(since).all<any>();
 return {days:d,since,summary:summary||{},byContent:byContent.results};
}

export async function createLeadMagnet(env:Env,actor:AuthUser,input:any){const title=String(input.title||'').trim().slice(0,180);const fileUrl=String(input.file_url||'').trim().slice(0,500);if(!title||!fileUrl)throw new Error('title_and_file_url_required');const now=new Date().toISOString(),id=randomId(),slug=slugify(String(input.slug||title));await env.DB.prepare(`INSERT INTO lead_magnets(id,title,slug,description,category_slug,file_url,cta_label,active,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`).bind(id,title,slug,String(input.description||'').slice(0,500),String(input.category_slug||'').slice(0,120)||null,fileUrl,String(input.cta_label||'Baixar grátis').slice(0,80),input.active===false?0:1,now,now).run();await writeAudit(env,{actorUserId:actor.id,action:'conversion.lead_magnet_created',resourceType:'lead_magnet',resourceId:id,metadata:{slug}});return getLeadMagnetAny(env,id);}
async function getLeadMagnetAny(env:Env,id:string){return await env.DB.prepare(`SELECT * FROM lead_magnets WHERE id=?`).bind(id).first<any>();}
export async function createCTA(env:Env,actor:AuthUser,input:any){const title=String(input.title||'').trim().slice(0,180);if(!title)throw new Error('cta_title_required');const now=new Date().toISOString(),id=randomId();await env.DB.prepare(`INSERT INTO content_ctas(id,post_id,category_id,magnet_id,title,description,button_text,destination,priority,active,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,input.post_id||null,input.category_id||null,input.magnet_id||null,title,String(input.description||'').slice(0,500),String(input.button_text||'Quero receber').slice(0,80),String(input.destination||'newsletter').slice(0,40),clamp(Number(input.priority||0),-100,1000),input.active===false?0:1,now,now).run();await writeAudit(env,{actorUserId:actor.id,action:'conversion.cta_created',resourceType:'content_cta',resourceId:id,metadata:{destination:input.destination||'newsletter'}});return env.DB.prepare(`SELECT * FROM content_ctas WHERE id=?`).bind(id).first<any>();}
