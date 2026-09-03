import type { APIRoute } from 'astro';
import { getPublishedPosts, postUrl } from '../lib/editorial';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPublishedPosts())
    .sort((a, b) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
    .slice(0, 50);
  const base = site?.href ?? 'https://dejotacode.com.br/';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Dejotacode</title>
    <link>${base}</link>
    <description>Tutoriais simples, tecnologia e estratégias práticas para aprender, construir e monetizar.</description>
    <language>pt-BR</language>
    ${posts.map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${new URL(postUrl(post), base).href}</link><guid isPermaLink="true">${new URL(postUrl(post), base).href}</guid><pubDate>${post.publishedAt.toUTCString()}</pubDate><description><![CDATA[${post.description}]]></description></item>`).join('')}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
