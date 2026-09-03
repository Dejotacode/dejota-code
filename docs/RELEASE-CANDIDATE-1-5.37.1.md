# Dejotacode V1.0.0 — Release Candidate 1

Data do congelamento local: 2026-09-03.
Versão semântica do candidato: `1.0.0-rc.1`.

## Objetivo

Congelar uma base local tecnicamente homologada para a última revisão antes da publicação da V1.0.0.
O RC1 não é a release final e não implica que Cloudflare/D1 remoto estejam homologados.

## Arquitetura congelada

`CMS → D1 → API Hono → Astro build → Cloudflare Pages`

- Astro/Pages: frontend público.
- Hono/Worker: API, autenticação, CMS e serviços internos.
- D1: fonte de verdade editorial.
- R2: mídia.
- Deploy Hook: rebuild do Pages após mutações editoriais relevantes.

## Regras de release

Arquivos e diretórios locais que não entram no repositório/pacote de fonte:
- `node_modules/`
- `dist/`
- `.astro/`
- `.wrangler/`
- `.dev.vars`
- `.env*` reais
- `wrangler.toml` local
- logs e arquivos temporários

Arquivos de exemplo seguros que entram:
- `.dev.vars.example`
- `pages.env.example`
- `wrangler.toml.example`

## Variáveis de produção

Cloudflare Pages:
- `API_URL`: origem da API usada durante o build.
- `PUBLIC_API_URL`: origem da API usada pelo navegador.

Cloudflare Worker:
- `APP_ENV`
- `SESSION_TTL_SECONDS`
- `APP_URL`
- `PAGES_DEPLOY_HOOK_URL` como secret
- `BOOTSTRAP_TOKEN` como secret temporário de bootstrap

Nunca versionar valores reais de secrets.

## Gate RC1

Executar:

```bash
npm ci
npm run db:local
npm run release:check
```

O `release:check` valida higiene de release e executa:
- Astro/TypeScript check;
- build completo CMS → API → Astro;
- validador de URLs/SEO;
- o gate de código/build/URLs.

O dry-run do Worker é executado separadamente com `npx wrangler deploy --dry-run`, evitando que comportamento interno do Wrangler mantenha o processo do gate aberto em alguns ambientes.

## Gate de produção ainda pendente

Antes da V1.0.0 final:
1. criar/configurar D1 e R2 reais;
2. revisar `wrangler.toml` local com IDs reais sem versioná-lo;
3. aplicar migrations `0001–0013` no D1 remoto;
4. configurar secrets e variáveis reais;
5. publicar Worker;
6. configurar Pages e Deploy Hook;
7. publicar Pages;
8. validar domínio, DNS e HTTPS;
9. executar smoke test pós-deploy;
10. somente então promover `1.0.0-rc.1` para `1.0.0`.

## Limpeza do candidato

Durante o congelamento foi removido um artefato HTML gerado e órfão em `ia/index.html` na raiz. A página oficial continua sendo gerada por `src/pages/ia/index.astro`; portanto o arquivo raiz não fazia parte da fonte e não deve entrar no RC.

Foi também ajustado `BUILD.sh` para usar `npm ci`, garantindo instalação reprodutível a partir do `package-lock.json`.

## Política de congelamento

Durante RC1, correções permitidas são somente bugs bloqueadores, segurança, configuração de deploy e documentação de release. Novas funcionalidades ficam para versão posterior.
