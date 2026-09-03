# Changelog

## 1.0.0-rc.1 — 2026-09-03

Primeiro Release Candidate da V1.0.0 do Dejotacode.

### Incluído
- site público Astro preparado para Cloudflare Pages;
- backend Hono preparado para Cloudflare Worker;
- D1 como fonte de verdade editorial;
- R2 para biblioteca de mídia;
- CMS, autenticação, sessões e RBAC;
- hardening de login, bootstrap de owner e rate limiting;
- fluxo CMS → API → Astro e solicitação de rebuild por Pages Deploy Hook;
- newsletter, briefing, feedback, analytics, comentários e conversão;
- URLs canônicas, sitemap, RSS, redirects legados e validação SEO;
- migrations D1 `0001` a `0013`;
- QA funcional e regressão local concluídos antes do congelamento do RC1.

### Não homologado em produção neste RC
- migrations no D1 remoto;
- secrets reais do Worker;
- Deploy Hook real do Cloudflare Pages;
- DNS/domínio/HTTPS reais;
- teste pós-deploy em produção.
