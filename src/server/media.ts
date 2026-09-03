import type { Env, AuthUser } from './types';
import { randomId } from './security';
import { writeAudit } from './db';

const MAX_BYTES = 5 * 1024 * 1024;
const MIME_EXT: Record<string,string> = {
  'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'
};

export function mediaExtension(mime: string) { return MIME_EXT[mime] || ''; }

export async function listMedia(env: Env, limit=100, offset=0) {
  const l=Math.min(Math.max(Number(limit||100),1),100), o=Math.max(Number(offset||0),0);
  return (await env.DB.prepare(`SELECT m.id,m.storage_key,m.filename,m.mime_type,m.size_bytes,m.alt_text,m.title,m.uploaded_by,m.created_at,u.name uploader_name FROM media_assets m JOIN users u ON u.id=m.uploaded_by ORDER BY m.created_at DESC LIMIT ? OFFSET ?`).bind(l,o).all<any>()).results;
}

export async function getMedia(env: Env, id: string) {
  return await env.DB.prepare(`SELECT * FROM media_assets WHERE id=?`).bind(id).first<any>();
}

export async function uploadMedia(env: Env, actor: AuthUser, file: File, altText?: string, title?: string) {
  if (!env.MEDIA) throw new Error('media_storage_not_configured');
  const mime=file.type.toLowerCase(), ext=mediaExtension(mime);
  if (!ext) throw new Error('unsupported_image_type');
  if (file.size<=0 || file.size>MAX_BYTES) throw new Error('image_too_large');
  const id=randomId(), now=new Date().toISOString();
  const key=`media/${now.slice(0,7).replace('-','/')}/${id}.${ext}`;
  const bytes=await file.arrayBuffer();
  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType:mime, cacheControl:'public, max-age=31536000, immutable' }, customMetadata:{ uploadedBy:actor.id, originalName:file.name.slice(0,180) } });
  try {
    await env.DB.prepare(`INSERT INTO media_assets(id,storage_key,filename,mime_type,size_bytes,alt_text,title,uploaded_by,created_at) VALUES(?,?,?,?,?,?,?,?,?)`).bind(id,key,file.name.slice(0,180),mime,file.size,(altText||'').trim().slice(0,250)||null,(title||'').trim().slice(0,180)||null,actor.id,now).run();
  } catch(e) { await env.MEDIA.delete(key); throw e; }
  await writeAudit(env,{actorUserId:actor.id,action:'media.uploaded',resourceType:'media',resourceId:id,metadata:{mimeType:mime,sizeBytes:file.size}});
  return {id,storageKey:key,filename:file.name.slice(0,180),mimeType:mime,sizeBytes:file.size,altText:(altText||'').trim().slice(0,250)||null,title:(title||'').trim().slice(0,180)||null,createdAt:now};
}

export async function deleteMedia(env: Env, actor: AuthUser, id: string) {
  if (!env.MEDIA) throw new Error('media_storage_not_configured');
  const row=await getMedia(env,id); if(!row) throw new Error('media_not_found');
  await env.MEDIA.delete(row.storage_key);
  await env.DB.prepare(`DELETE FROM media_assets WHERE id=?`).bind(id).run();
  await writeAudit(env,{actorUserId:actor.id,action:'media.deleted',resourceType:'media',resourceId:id,metadata:{storageKey:row.storage_key}});
}
