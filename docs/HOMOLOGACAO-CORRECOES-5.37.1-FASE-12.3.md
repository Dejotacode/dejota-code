# Etapa 5.37.1 — Fase 12.3 — Correções dos Bugs de Homologação

## Objetivo
Corrigir os bloqueadores encontrados na homologação funcional antes do Release Candidate.

## Correções aplicadas

- RBAC editorial: `editor` pode criar/editar rascunho/revisão, mas publicação e alteração/exclusão de conteúdo publicado exigem `admin` ou `owner`.
- Datas editoriais: consultas públicas usam `julianday()` para comparar corretamente datas ISO-8601 (`2026-09-03T10:00:00.000Z`) com o relógio do SQLite. Artigos futuros não entram na API pública nem no build.
- Segurança: seed administrativo permanece desativado pela migration `0012_security_hardening.sql`; bootstrap e rate limit permanecem ativos.
- CMS → Site: D1 continua como fonte editorial oficial; Astro consome a API no build.
- CMS → Deploy: mutações publicadas continuam disparando o Deploy Hook quando `PAGES_DEPLOY_HOOK_URL` está configurado.
- Frontend duplicado: Worker continua limitado a API, admin, mídia e redirects legados; o frontend público oficial é Astro/Pages.
- Formulários públicos: newsletter, briefing e feedback passam a usar a API própria. `PUBLIC_API_URL` aponta o frontend para o Worker em produção.
- CORS: a API libera apenas a origem configurada em `APP_URL` para chamadas cross-origin do site público.
- Briefing/feedback: migration `0013_public_forms.sql` adiciona armazenamento D1 e rate limit básico para os endpoints públicos.
- Business OS: telas internas estáticas foram removidas de `src/pages` e preservadas em `docs/legacy-business-os`, fora do build público.
- Links: referências antigas foram consolidadas para as URLs canônicas atuais.

## Novos endpoints públicos

- `POST /api/public/briefing`
- `POST /api/public/feedback`
- `POST /api/newsletter/subscribe`
- `POST /api/newsletter/subscribe-interest`

## Variáveis de produção

Pages:
- `API_URL`: API usada durante o build editorial.
- `PUBLIC_API_URL`: origem pública do Worker usada pelos formulários no navegador.

Worker:
- `APP_URL`: origem canônica do site público, usada para validação de Origin/CORS.
- `PAGES_DEPLOY_HOOK_URL`: secret opcional para rebuild automático.
- `BOOTSTRAP_TOKEN`: secret temporário para criação inicial do owner.

## Validações locais executadas

- `npm run check`: 110 arquivos, 0 erros, 0 warnings, 0 hints.
- `npm run build`: 41 páginas públicas.
- `npm run validate:urls`: OK; 4 artigos canônicos.
- Auditoria de links: 1.827 links internos verificados; 0 quebrados (considerando redirects configurados).
- Worker dry-run: bundle válido.
- Editor tentando publicar diretamente: `403 publish_permission_required`.
- Artigo ISO passado: `200`; artigo ISO futuro: `404`; listagem pública exclui futuro.
- Briefing: `201 received` e persistência D1.
- Feedback: `201 received` e persistência D1.
- CORS preflight da origem `APP_URL`: `204` com headers restritos à origem configurada.
- Seed admin local: `active = 0`.
- Registros temporários de QA removidos após os testes.

## Pendências deliberadamente fora desta fase

- Configurar os valores reais de `API_URL`, `PUBLIC_API_URL`, `APP_URL`, `PAGES_DEPLOY_HOOK_URL` e secrets na Cloudflare.
- Aplicar migrations no D1 remoto somente após confirmar o `database_id` real.
- Testar o Deploy Hook real e domínio final.
- Criar a futura interface privada do Business OS sob autenticação real.

Nenhum ZIP foi gerado nesta fase.
