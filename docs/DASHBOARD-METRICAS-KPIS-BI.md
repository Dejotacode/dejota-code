# Etapa 5.25 — Dashboard de Métricas + KPIs + Business Intelligence

## Objetivo
Criar a camada de inteligência da Dejotacode para transformar eventos de marketing, conteúdo, CRM, vendas, projetos e pós-venda em indicadores de gestão.

## Princípio
O dashboard não deve inventar números. Sem uma integração real, os cards permanecem como placeholders e a arquitetura documenta como os dados serão calculados.

## Visões
- Executivo: aquisição, leads, vendas, receita, ticket e satisfação.
- Marketing & Conteúdo: tráfego, páginas, engajamento, CTAs, origem e downloads.
- Comercial: leads, qualificação, propostas, negociações, ganhos e ticket.
- Operação: projetos, marcos, atrasos, entregas, revisões e conclusão.
- Customer Success: satisfação, depoimentos, cases, indicações e reativação.

## Funil
Sessões → Interesse → Lead → Lead qualificado → Proposta → Venda → Projeto concluído → Indicação.

## KPIs principais
1. Sessões — `sessions`
2. Engajamento — `engaged sessions / sessions`
3. Conversão em lead — `leads / sessions × 100`
4. Qualificação — `qualified leads / leads × 100`
5. Taxa de proposta — `proposals / qualified leads × 100`
6. Fechamento — `won deals / proposals × 100`
7. Ticket médio — `revenue / won deals`
8. Entrega no prazo — `on-time projects / completed projects × 100`
9. Satisfação média — `sum ratings / responses`
10. Conversão por indicação — `won referrals / referrals × 100`

## Governança
- Definir cada métrica antes de criar metas.
- Usar períodos comparáveis.
- Documentar alterações relevantes.
- Minimizar dados pessoais.
- Restringir acesso a informações comerciais.
- Separar métricas de vaidade de métricas acionáveis.
- Quando não houver dados, exibir ausência de dados em vez de preencher valores fictícios.

## Integrações futuras
A camada é provider-neutral. Uma integração futura pode alimentar o modelo a partir de analytics, CRM, pagamentos, projetos e feedback, sem acoplar o front-end a um fornecedor específico.
