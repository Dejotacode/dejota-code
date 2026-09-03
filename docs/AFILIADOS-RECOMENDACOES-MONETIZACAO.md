# Etapa 5.19 — Afiliados + Estratégia de Recomendações + Monetização por Conteúdo

## Objetivo
Criar uma camada de monetização por afiliados que preserve a confiança editorial e conecte recomendações a problemas reais dos leitores.

## Princípio
A Dejotacode não recomenda uma ferramenta apenas porque existe comissão. Primeiro vem o conteúdo, depois o contexto, os critérios, as alternativas e a transparência.

## Funil
1. Conteúdo responde uma dúvida real.
2. Contexto explica quando uma solução faz sentido.
3. Recomendação apresenta critérios e limitações.
4. Clique leva ao fornecedor oficial.
5. Conversão acontece no ambiente do fornecedor.
6. Dados de clique e feedback orientam atualizações.

## Categorias iniciais
- Hospedagem e infraestrutura
- Ferramentas de desenvolvimento
- Ferramentas de IA
- Ferramentas para negócios digitais

## Regras editoriais
- Identificar relações de afiliado.
- Não inventar testes, experiência ou resultados.
- Separar informação do fornecedor de opinião editorial.
- Mostrar limitações e custos relevantes.
- Comparar alternativas quando útil.
- Preferir links oficiais.
- Atualizar páginas quando preço, produto ou condições mudarem.

## Implementação
- `src/data/affiliates.ts`: estratégia, categorias, eventos e recomendações planejadas.
- `src/components/AffiliateDisclosure.astro`: aviso reutilizável.
- `/afiliados/`: política e estratégia.
- `/recomendacoes/`: central de recomendações.
- Eventos: `affiliate_impression`, `affiliate_view`, `affiliate_click`, `affiliate_outbound`, `affiliate_conversion`, `affiliate_update`, `recommendation_feedback`.

## Limite da etapa
Nenhum programa de afiliados ou link comercial real foi ativado. Os itens da central estão planejados para evitar links inventados ou recomendações sem validação.
