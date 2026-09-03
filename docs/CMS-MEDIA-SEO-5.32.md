# Etapa 5.32 — Media Library + Upload + Editor Rico + Preview + SEO On-Page

## Entrega
Evolução incremental sobre a etapa 5.31. O D1 armazena metadados de mídia; Cloudflare R2 armazena os bytes das imagens.

## Media Library
- PNG, JPEG, WebP e GIF.
- Limite de 5 MB por arquivo.
- Chave R2 versionada por ano/mês.
- Metadados: nome, MIME, tamanho, alt text, título, autor e data.
- Upload e exclusão auditados.
- Servido por `/media/:id` com cache longo.

## Editor rico
- `contenteditable` com toolbar de negrito, itálico, H2/H3, listas, citação e links.
- Inserção de imagens da Media Library.
- Conteúdo final continua sendo sanitizado no servidor.

## Preview
Pré-visualização no painel antes de salvar/publicar.

## SEO On-Page
Checklist client-side com pontuação indicativa: título, SEO title, meta description, slug, palavra-chave foco, H2, imagem, links e conteúdo. A pontuação é orientação editorial, não garantia de ranking.

## Segurança
- Autenticação + RBAC da etapa 5.30/5.31.
- Same-Origin check para mutações.
- Tipos MIME allowlist.
- Limite de tamanho.
- R2 não é usado se o binding não estiver configurado.
- Segredos e credenciais permanecem no backend.

## Cloudflare
Configure o binding `MEDIA` para um bucket R2 no `wrangler.toml`. A migration `0003_media.sql` cria a tabela `media_assets`.

## Importante
A etapa é incremental e não substitui a necessidade de integrar as páginas públicas do blog à API em uma próxima etapa.
