import type { Env } from './types';
import { randomId, sha256 } from './security';

const EVENT_NAMES = new Set(['page_view','article_view','read_progress','article_complete','engaged_read','recommendation_click']);
const clamp = (n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));

export async function recordEditorialEvent(env: Env, input:{eventName:string;postId?:string;sessionId?:string;visitorId?:string;path?:string;referrer?:string;progress?:number;durationMs?:number;metadata?:unknown;actorUserId?:string}) {
  if(!EVENT_NAMES.has(input.eventName)) throw new Error('invalid_editorial_event');
  const now=new Date().toISOString();
  await env.DB.prepare(`INSERT INTO editorial_events(id,event_name,post_id,session_id,visitor_id,path,referrer,progress,duration_ms,metadata_json,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(randomId(),input.eventName,input.postId||null,input.sessionId||null,input.visitorId?await visitorHash(input.visitorId):null,(input.path||'').slice(0,500)||null,(input.referrer||'').slice(0,500)||null,input.progress==null?null:clamp(Math.floor(input.progress),0,100),input.durationMs==null?null:clamp(Math.floor(input.durationMs),0,86400000),input.metadata?JSON.stringify(input.metadata):null,now).run();
}

export async function visitorHash(value:string):Promise<string>{ return sha256(value.slice(0,160)); }

export async function getEditorialDashboard(env:Env, days=30){
  const d=clamp(Math.floor(days||30),1,365); const since=new Date(Date.now()-d*86400000).toISOString();
  const [summary,popular,trending,featured]=await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) total_events, COUNT(DISTINCT visitor_id) unique_visitors, COUNT(DISTINCT CASE WHEN event_name='article_view' THEN visitor_id END) article_visitors, COUNT(CASE WHEN event_name='article_complete' THEN 1 END) completions, AVG(CASE WHEN event_name='read_progress' THEN progress END) avg_progress FROM editorial_events WHERE created_at>=?`).bind(since).first<any>(),
    env.DB.prepare(`SELECT p.id,p.title,p.slug,c.name category_name, COUNT(e.id) views, COUNT(DISTINCT e.visitor_id) unique_visitors, ROUND(AVG(CASE WHEN e.event_name='read_progress' THEN e.progress END),1) avg_progress FROM posts p JOIN categories c ON c.id=p.category_id JOIN editorial_events e ON e.post_id=p.id WHERE p.status='published' AND e.created_at>=? AND e.event_name IN ('article_view','article_complete','engaged_read') GROUP BY p.id ORDER BY views DESC LIMIT 10`).bind(since).all<any>(),
    env.DB.prepare(`SELECT p.id,p.title,p.slug,c.name category_name, COUNT(e.id) score FROM posts p JOIN categories c ON c.id=p.category_id JOIN editorial_events e ON e.post_id=p.id WHERE p.status='published' AND e.created_at>=datetime('now','-7 day') AND e.event_name IN ('article_view','engaged_read','article_complete','recommendation_click') GROUP BY p.id ORDER BY score DESC LIMIT 6`).all<any>(),
    env.DB.prepare(`SELECT p.id,p.title,p.slug,p.featured_image,c.name category_name FROM posts p JOIN categories c ON c.id=p.category_id WHERE p.status='published' ORDER BY COALESCE(p.published_at,p.updated_at) DESC LIMIT 3`).all<any>()
  ]);
  return {days:d,since,summary:summary||{},popular:popular.results,trending:trending.results,featured:featured.results};
}

export async function getPersonalizedPosts(env:Env, visitorId:string, excludeId?:string, limit=4){
  const vid=await visitorHash(visitorId); const n=clamp(Math.floor(limit||4),1,8);
  const recent=await env.DB.prepare(`SELECT DISTINCT p.category_id FROM editorial_events e JOIN posts p ON p.id=e.post_id WHERE e.visitor_id=? AND p.status='published' ORDER BY e.created_at DESC LIMIT 5`).bind(vid).all<any>();
  const categoryIds=recent.results.map((r:any)=>r.category_id).filter(Boolean);
  if(categoryIds.length){
    const placeholders=categoryIds.map(()=>'?').join(','); const binds:any[]=[...categoryIds]; if(excludeId)binds.push(excludeId); binds.push(n);
    const sql=`SELECT p.id,p.title,p.slug,p.excerpt,p.featured_image,p.published_at,c.name category_name,c.slug category_slug,u.name author_name FROM posts p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id WHERE p.status='published' AND p.category_id IN (${placeholders}) ${excludeId?'AND p.id<>?':''} ORDER BY COALESCE(p.published_at,p.updated_at) DESC LIMIT ?`;
    return (await env.DB.prepare(sql).bind(...binds).all<any>()).results;
  }
  return (await env.DB.prepare(`SELECT p.id,p.title,p.slug,p.excerpt,p.featured_image,p.published_at,c.name category_name,c.slug category_slug,u.name author_name FROM posts p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_user_id WHERE p.status='published' ${excludeId?'AND p.id<>?':''} ORDER BY COALESCE(p.published_at,p.updated_at) DESC LIMIT ?`).bind(...(excludeId?[excludeId,n]:[n])).all<any>()).results;
}
