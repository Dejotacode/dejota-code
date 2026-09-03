# Analytics Editorial — Etapa 5.36

## Modelo de dados
A migration `0006_analytics_editorial.sql` cria `editorial_events`. Cada evento pode registrar artigo, sessão, visitante, rota, origem, progresso e duração.

## Eventos
- `page_view`
- `article_view`
- `read_progress`
- `article_complete`
- `engaged_read`
- `recommendation_click`

## Métricas
O dashboard calcula visitantes únicos, volume de eventos, conclusões e progresso médio. Popularidade considera interações editoriais nos últimos 30 dias; trending usa uma janela de 7 dias.

## Personalização
O servidor usa o identificador first-party para descobrir categorias de artigos que o visitante já acessou. Recomendações priorizam essas categorias e excluem o artigo atual. Sem histórico, são usados os artigos publicados mais recentes.

## Segurança e privacidade
O endpoint valida o nome do evento e limita strings/números. O visitor ID é convertido em hash SHA-256 antes de persistência. Não envie dados pessoais ao campo `metadata`. Defina retenção e consentimento adequados antes de produção.
