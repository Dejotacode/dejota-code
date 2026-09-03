# Fase 14.1 — Ambiente local completo

O Dejotacode pode ser executado localmente sem D1 ou R2 remotos.

## Arquitetura local

- Astro: `http://127.0.0.1:4321`
- Worker/Hono: `http://127.0.0.1:8787`
- D1: emulado pelo Wrangler e persistido em `.wrangler/state`
- R2: emulado pelo Wrangler e persistido em `.wrangler/state`
- CMS/Admin: `http://127.0.0.1:8787/admin`

## Primeira execução

```bash
npm ci
cp .dev.vars.example .dev.vars
npm run local:setup
npm run dev:local
```

O comando `dev:local` reaplica migrations de modo idempotente e inicia API + Astro juntos.

## Execução em dois terminais

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev:web
```

## Bootstrap do primeiro owner local

Defina um `BOOTSTRAP_TOKEN` forte em `.dev.vars` antes de usar `/api/auth/bootstrap`. Nunca versionar `.dev.vars`.

## Persistência

Os dados locais ficam em `.wrangler/state`. Apagar essa pasta reinicia o estado local de D1/R2. Faça isso apenas quando realmente quiser zerar o ambiente.

## Produção

`wrangler.local.toml` existe apenas para desenvolvimento. A produção continua usando a configuração real do Worker e recursos Cloudflare remotos.
