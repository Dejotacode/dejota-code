# Etapa 5.31 — CMS + Gestão de Blog + Editor + Categorias + SEO

## Objetivo
Substituir a edição manual de `posts.json` por uma camada editorial persistente em Cloudflare D1, integrada ao painel administrativo da etapa 5.30.

## Entregas
- Tabelas `categories` e `posts` em D1.
- Categorias oficiais pré-cadastradas.
- CRUD de artigos.
- CRUD de categorias.
- Estados `draft`, `review`, `published`, `archived`.
- Editor HTML controlado.
- Sanitização server-side contra tags/event handlers perigosos e URLs `javascript:`/`data:`.
- Campos SEO: title, description, canonical, OG image, robots e Schema JSON.
- API pública somente para artigos publicados.
- API administrativa protegida por sessão + RBAC (`owner`, `admin`, `editor`).
- Auditoria das operações editoriais.
- Proteção adicional de origem nas mutações feitas pelo painel.
- Interface CMS responsiva no `/admin`.

## API
### Pública
- `GET /api/blog/categories`
- `GET /api/blog/posts`
- `GET /api/blog/posts/slug/:slug`

### Administrativa
- `GET /api/admin/blog/posts`
- `GET /api/admin/blog/posts/:id`
- `POST /api/admin/blog/posts`
- `PUT /api/admin/blog/posts/:id`
- `DELETE /api/admin/blog/posts/:id`
- `POST /api/admin/blog/categories`
- `PUT /api/admin/blog/categories/:id`
- `DELETE /api/admin/blog/categories/:id`

## Modelo editorial
`posts` guarda título, slug, resumo, HTML sanitizado, imagem, autor, categoria, status, publicação e metadados SEO.

## Segurança
O navegador não é autoridade de segurança. O servidor valida autenticação/RBAC, categoria, status, slug e sanitiza HTML antes de persistir. Segredos continuam somente no backend.

## Observação
Esta entrega é incremental sobre a base da etapa 5.30. Ela não deve ser tratada como um snapshot completo da V1.0.0 original.
