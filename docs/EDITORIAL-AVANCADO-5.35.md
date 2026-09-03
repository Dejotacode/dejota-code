# Etapa 5.35 — Sistema Editorial Avançado

## Entrega
- Tags e relação post/tag no D1.
- Página pública de tag e tags no artigo.
- Página pública de autor baseada nos usuários ativos.
- Comentários com moderação: pending, approved, spam e rejected.
- Newsletter integrada ao frontend com armazenamento de consentimento e origem.
- Recomendações por categoria + sobreposição de tags.
- Sitemap incluindo tags e autores presentes nos posts publicados.
- Painel administrativo com moderação de comentários e consulta de assinantes.

## API pública
- `GET /api/blog/tags`
- `GET /api/blog/posts/:id/tags`
- `GET /api/blog/posts/:id/comments`
- `POST /api/blog/comments`
- `POST /api/newsletter/subscribe`

## API administrativa
- `GET /api/admin/editorial/comments`
- `PATCH /api/admin/editorial/comments/:id`
- `GET /api/admin/editorial/newsletter`

## Rotas públicas
- `/autor/:id`
- `/tag/:slug`

## Segurança e privacidade
- Comentários começam como `pending` e só aparecem após aprovação.
- E-mail de comentário é opcional e não é exibido publicamente.
- IP é armazenado apenas como hash com salt fixo de aplicação para reduzir exposição direta; para produção, considerar segredo rotacionável via variável privada.
- Formulários públicos exigem same-origin quando o navegador envia `Origin`.
- Não há envio real de e-mails nesta etapa. A newsletter registra assinaturas no D1 e fica pronta para integração posterior com um provedor.
- O mecanismo de recomendação é determinístico e editorialmente explicável; não é um modelo de IA.
