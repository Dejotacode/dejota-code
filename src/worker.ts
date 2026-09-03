import { Hono } from 'hono';
import { api } from './server/api';
import type { Env } from './server/types';
import { adminPage } from './admin/page';
import { getMedia } from './server/media';
import { getPublishedBySlug } from './server/cms';

const app = new Hono<{ Bindings: Env }>();
app.route('/api', api);
app.get('/admin', (c) => c.html(adminPage));
app.get('/admin/', (c) => c.html(adminPage));
app.get('/media/:id', async (c) => {
  const row = await getMedia(c.env, c.req.param('id'));
  if (!row || !c.env.MEDIA) return c.notFound();
  const obj = await c.env.MEDIA.get(row.storage_key);
  if (!obj) return c.notFound();
  const headers = new Headers(); obj.writeHttpMetadata(headers); headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(obj.body, { headers });
});

// Canonicalização das rotas públicas legadas. O site oficial é o Astro/Pages.
const redirects: Record<string,string> = {
  '/feed.xml': '/rss.xml',
  '/sitemap.xml': '/sitemap-index.xml',
  '/buscar': '/buscar/',
};
for (const [from, to] of Object.entries(redirects)) app.get(from, (c) => c.redirect(to, 301));
app.get('/artigo/:slug', async (c) => { const post = await getPublishedBySlug(c.env, c.req.param('slug')); if (!post) return c.notFound(); return c.redirect(`/blog/${encodeURIComponent(post.category_slug)}/${encodeURIComponent(post.slug)}/`, 301); });
app.get('/categoria/:slug', (c) => c.redirect(`/${encodeURIComponent(c.req.param('slug'))}/`, 301));
app.get('/tag/:slug', (c) => c.redirect(`/tags/${encodeURIComponent(c.req.param('slug'))}/`, 301));
app.get('/autor/:id', (c) => c.redirect('/sobre/autor/', 301));

app.notFound((c) => c.json({ error: 'not_found' }, 404));
export default app;
