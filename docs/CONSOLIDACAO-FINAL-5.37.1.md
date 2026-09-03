# Dejotacode — Consolidação Final 5.37.1

## Fonte de verdade

A fonte de verdade editorial é o CMS armazenado no Cloudflare D1.

Fluxo oficial:

CMS → D1 → API pública → Astro build → Cloudflare Pages

Os antigos Markdown foram preservados em `docs/legacy-content/posts/` apenas como referência histórica. Eles não participam mais do build público.

## Publicação automática

Quando um post publicado é criado, publicado, atualizado, despublicado ou excluído, o Worker solicita um novo build por meio de `PAGES_DEPLOY_HOOK_URL`.

Categorias também acionam rebuild quando criadas, alteradas ou excluídas.

A URL do Deploy Hook é segredo e deve ser configurada no Worker, nunca no Git.

## Produção

O build do Pages deve receber:

`API_URL=https://api.dejotacode.com.br`

Substitua pelo endereço real do Worker/API caso o domínio usado seja outro.

O Worker deve receber o secret:

`PAGES_DEPLOY_HOOK_URL=<URL GERADA PELO CLOUDFLARE>`

## URLs oficiais

- `/blog/`
- `/blog/{categoria}/{slug}/`
- `/{categoria}/`
- `/tags/{slug}/`
- `/buscar/`
- `/rss.xml`
- `/sitemap-index.xml`
- `/robots.txt`

Rotas antigas são tratadas por redirects quando possível.

## Validação

Executar:

```bash
npm run check
npm run build
npm run validate:urls
npx wrangler deploy --dry-run
```

## Regra de release

Não incluir no ZIP final: `node_modules/`, `dist/`, `.astro/`, `.wrangler/`, `.env*`, `.dev.vars` ou `wrangler.toml` com valores locais/secretos.
