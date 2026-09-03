# Especificação — Etapa 5.33

## Arquitetura
Browser → Cloudflare Worker/Hono → D1/CMS → HTML SSR.

A renderização pública ocorre no servidor para que crawlers recebam HTML já preenchido com títulos, descrições, conteúdo e dados estruturados.

## Rotas
| Rota | Função |
|---|---|
| `/` | Home com artigos recentes e categorias |
| `/artigo/:slug` | Artigo publicado |
| `/categoria/:slug` | Arquivo da categoria |
| `/sitemap.xml` | Sitemap XML dinâmico |
| `/robots.txt` | Diretrizes para crawlers |

## Regras de publicação
- Home, categorias, artigos e sitemap usam somente `status='published'`.
- Artigos futuros com `published_at` ainda não ficam públicos.
- Conteúdo inexistente retorna 404.
- 404 recebe `noindex,follow`.

## SEO automático
Cada página pública gera:
- `<title>`;
- meta description;
- robots;
- canonical;
- Open Graph;
- Twitter Card;
- JSON-LD.

Artigos usam `Article`; a home usa `WebSite`; categorias usam `CollectionPage`.

## URLs canônicas
A variável opcional `APP_URL` permite fixar o domínio oficial, evitando que preview URLs virem canônicas em produção.

## Sitemap
O Worker consulta categorias e artigos publicados e monta o XML em cada requisição, com cache HTTP curto de 5 minutos.

## Performance
O HTML é produzido diretamente no Worker e o conteúdo não precisa de uma segunda chamada HTTP ao próprio endpoint de API. Imagens permanecem servidas pelo endpoint `/media/:id` criado na Etapa 5.32 quando esse valor for usado no conteúdo.

## Próxima evolução sugerida
Etapa 5.34 — Busca pública + paginação + filtros + related posts + breadcrumbs + RSS/Atom + otimização de cache e headers.
