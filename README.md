# Dejotacode V1.0.0 — RC1

Plataforma editorial e Business OS do Dejotacode.

## Arquitetura

- **Astro + Cloudflare Pages:** site público estático.
- **Hono + Cloudflare Worker:** API, autenticação, CMS, analytics, conversão e Business OS.
- **Cloudflare D1:** banco de dados e fonte de verdade editorial.
- **Cloudflare R2:** biblioteca de mídia.

## CMS → Site

O conteúdo editorial público vem do CMS/D1 durante o build do Astro:

`CMS → D1 → API → Astro → Pages`

Os antigos arquivos Markdown foram preservados somente em `docs/legacy-content/` como referência e não são mais usados para gerar o site.

## Publicação automática

O Worker pode solicitar um novo deploy do Cloudflare Pages por Deploy Hook quando conteúdo publicado ou categorias são alterados.

Configure `PAGES_DEPLOY_HOOK_URL` como **secret do Worker**. Nunca coloque a URL real em arquivos versionados.

No projeto Pages, configure `API_URL` apontando para a URL pública da API.

## Desenvolvimento local

Requisitos:

- Node.js 20+
- npm
- Wrangler

Instale dependências:

```bash
npm install
```

Aplique as migrations locais:

```bash
npm run db:local
```

Verifique o projeto:

```bash
npm run check
```

Faça o build:

```bash
npm run build
```

Valide URLs e SEO:

```bash
npm run validate:urls
```

## Estrutura pública

```text
/blog/
/blog/{categoria}/{slug}/
/programacao/
/linux-seguranca/
/criptoativos/
/renda-digital/
/ia/
/tech-tendencias/
/tutoriais-guias/
/tags/{slug}/
/buscar/
/rss.xml
/sitemap-index.xml
/robots.txt
```

## Segurança

Não versionar:

- `.env`
- `.dev.vars`
- secrets
- credenciais
- tokens
- URLs privadas de Deploy Hook

## Release

Para validar o Release Candidate local:

```bash
npm run release:check
```

Consulte `docs/RELEASE-CANDIDATE-1-5.37.1.md` e `docs/CONSOLIDACAO-FINAL-5.37.1.md` para o gate de release, arquitetura e homologação.

## Desenvolvimento local completo (Fase 14.1)

Para iniciar Astro + Worker + D1 + R2 localmente:

```bash
npm ci
cp .dev.vars.example .dev.vars
npm run dev:local
```

- Site: `http://127.0.0.1:4321`
- API: `http://127.0.0.1:8787`
- Admin/CMS: `http://127.0.0.1:8787/admin`

Consulte `docs/AMBIENTE-LOCAL-FASE-14.1.md` para o fluxo completo.
