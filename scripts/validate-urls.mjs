import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const required = ['index.html','blog/index.html','rss.xml','robots.txt','sitemap-index.xml'];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const articleDirs = [];
function walk(dir, rel='') { for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { const r=path.join(rel,entry.name); if(entry.isDirectory()) walk(path.join(dir,entry.name),r); else if(entry.name==='index.html' && r.startsWith('blog/')) articleDirs.push(r); } }
if (fs.existsSync(root)) walk(root);
if (missing.length || !articleDirs.length) { console.error('URL/SEO validation: FAIL', {missing, articleDirs}); process.exit(1); }
const sitemap = fs.readFileSync(path.join(root,'sitemap-index.xml'),'utf8');
if (!sitemap.includes('sitemap-0.xml')) { console.error('URL/SEO validation: sitemap index inválido'); process.exit(1); }
const articlePages = articleDirs.filter((x) => x !== 'blog/index.html'); if (articlePages.length !== 4) { console.error('URL/SEO validation: expected 4 canonical article pages', articlePages); process.exit(1); } console.log(`URL/SEO validation: OK\nCanonical article pages: ${articlePages.length}`);
