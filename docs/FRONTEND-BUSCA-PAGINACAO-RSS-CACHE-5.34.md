# Etapa 5.34 — Busca Pública + Paginação + Filtros + Related Posts + Breadcrumbs + RSS + Cache

## Entrega
- Busca pública SSR em `/buscar`.
- Filtro por categoria e termo.
- Paginação SSR em `/buscar` e `/categoria/:slug`.
- Pesquisa em título, resumo e conteúdo do artigo.
- Related Posts por categoria, excluindo o artigo atual.
- Breadcrumbs sem dependência de JavaScript.
- Feed RSS 2.0 em `/feed.xml` e alias `/rss.xml`.
- Cache HTTP para HTML público, com ETag e `s-maxage`.
- Cache de 5 minutos para sitemap e RSS.
- Links RSS e busca adicionados à navegação/footer.
- Search Results pages filtradas recebem `noindex,follow` para evitar indexação de combinações de busca.

## Rotas
| Rota | Função |
|---|---|
| `/buscar?q=...&categoria=...&pagina=...` | Busca e filtros |
| `/categoria/:slug?pagina=...` | Arquivo paginado |
| `/artigo/:slug` | Artigo + relacionados + breadcrumbs |
| `/feed.xml` | RSS |
| `/rss.xml` | Alias RSS |
| `/sitemap.xml` | Sitemap dinâmico |

## Cache
HTML público:
`Cache-Control: public, max-age=0, s-maxage=60/120, stale-while-revalidate=300`

Sitemap/RSS:
`Cache-Control: public, max-age=300, s-maxage=300, stale-while-revalidate=900`

O ETag do HTML é calculado com SHA-256. Quando o cliente envia o mesmo `If-None-Match`, o Worker responde `304 Not Modified`.

## Paginação
A aplicação busca `PAGE_SIZE + 1` registros para descobrir se existe próxima página sem precisar de uma contagem adicional. O número exibido de páginas é deliberadamente conservador quando há mais resultados.

## SEO
- Breadcrumbs são HTML semântico.
- Busca com filtros/termos usa `noindex,follow`.
- Canonical preserva os parâmetros da página atual.
- RSS referencia o domínio configurado em `APP_URL`.

## Segurança
Os resultados públicos continuam restritos a `status='published'`. Dados de pesquisa são limitados e escapados no HTML. O conteúdo HTML dos artigos continua vindo do sanitizador do CMS.
