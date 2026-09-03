import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dejotacode.com.br',
  output: 'static',
  compressHTML: true,
  build: { format: 'directory' },
  integrations: [sitemap()]
});
