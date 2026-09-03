# Fase 12.4 — Homologação Final de Regressão

Data: 2026-09-03

## Objetivo
Reexecutar os principais testes técnicos e funcionais após as correções da Fase 12.3, validando que não houve regressão antes do Release Candidate.

## Resultado
Status: APROVADA LOCALMENTE, com produção ainda não homologada.

## Validações executadas
- `npm run check`: 110 arquivos, 0 erros, 0 warnings, 0 hints.
- `npm run build`: 41 páginas estáticas geradas.
- `npm run validate:urls`: OK; 4 páginas canônicas de artigo.
- `wrangler deploy --dry-run`: bundle gerado com sucesso.
- D1 local: todas as migrations 0001–0013 aplicadas.
- Seed `admin@dejotacode.com`: `active = 0`.
- API health: versão 1.0.0, apiVersion v1, stage 5.37.1.
- Rate limit de login: cinco falhas retornaram 401; sexta e sétima retornaram 429.
- API administrativa sem autenticação: 403.
- CORS preflight para origem confiável: 204 com origem restrita.
- API pública editorial: quatro artigos publicados retornados.
- Scanner de links do build: 2.037 referências internas verificadas, 0 quebradas.

## Regressão encontrada e corrigida
Durante o primeiro passe foi encontrado um link legado interno `/tutoriais/` no componente de navegação de cluster. A origem era `src/data/categories.ts`, ainda com o slug antigo `tutoriais`. Foi corrigido para `tutoriais-guias` e o nome consolidado `Tutoriais & Guias Práticos`.

Também foi corrigida uma URL duplicada em `src/data/email-marketing.ts`: `/blog/blog/tutoriais-guias/publicar-site/` passou para `/blog/tutoriais-guias/publicar-site/`.

Após as correções, o build e o scanner de links foram executados novamente e ficaram verdes.

## Limites desta homologação
Esta fase valida o ambiente local. Não foram declarados como testados:
- D1 remoto;
- secrets reais;
- domínio de produção;
- Cloudflare Pages real;
- Worker real;
- Deploy Hook real;
- propagação DNS;
- fluxo de publicação em produção.

Esses itens pertencem à homologação de produção/deploy.
