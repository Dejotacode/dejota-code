# Etapa 5.37 — Sistema de Conversão Editorial

## Objetivo
Transformar tráfego editorial em leads de forma contextual, sem depender de um CTA único para todo o site.

## Componentes
- CTAs dinâmicos por artigo e categoria.
- Lead magnets por categoria.
- Newsletter com seleção de interesses.
- Eventos de conversão ligados ao conteúdo.
- Dashboard de funil por conteúdo.
- Recomendação de material gratuito contextual.

## Funil
Impressão CTA → clique → captura → download do material → nutrição por interesse → conversão.

## Eventos
`cta_impression`, `cta_click`, `lead_magnet_view`, `lead_magnet_download`, `newsletter_interest_selected`, `lead_capture`, `content_conversion`.

## APIs
- `GET /api/blog/interests`
- `GET /api/blog/lead-magnets`
- `GET /api/blog/lead-magnets/:slug`
- `GET /api/blog/ctas?postId=&categoryId=&categorySlug=`
- `POST /api/newsletter/subscribe-interest`
- `POST /api/blog/conversion/events`
- `GET /api/admin/conversion/dashboard`
- `GET/POST /api/admin/conversion/lead-magnets`
- `GET/POST /api/admin/conversion/ctas`

## Segurança e LGPD
- E-mail continua sendo dado pessoal: finalidade, retenção e política de privacidade devem estar definidas antes de produção.
- IDs de visitante usados nos eventos são transformados em hash no servidor.
- Nenhum provedor de e-mail externo é acionado automaticamente.
- URLs de lead magnet são tratadas como conteúdo administrativo; publicar arquivos reais exige storage/rota de entrega configurados.

## Observação
Os lead magnets seed usam caminhos `/materiais/*.pdf` como placeholders. Eles não significam que os arquivos PDF existam ainda.
