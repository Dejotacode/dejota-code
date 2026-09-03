# Etapa 5.21 — CRM + Pipeline de Leads + Automação Comercial

## Objetivo
Transformar o funil de serviços da Dejotacode em uma operação comercial organizada: cada lead tem origem, estágio, próxima ação e histórico mínimo necessário.

## Pipeline
1. Novo lead
2. Qualificação
3. Diagnóstico
4. Proposta enviada
5. Negociação
6. Fechado ganho
7. Fechado perdido
8. Pós-venda

## Qualificação
O modelo usa pontos para priorizar leads por problema claro, urgência, aderência, prazo, investimento e acesso ao decisor. A pontuação é uma heurística operacional, não uma promessa de conversão.

## Automação
Eventos como `briefing_submit`, `proposal_view`, `proposal_accept` e `service_completed` podem alimentar um CRM depois que um provedor e endpoint seguro forem escolhidos.

A V1 mantém a integração **provider-neutral** e desligada. Não existe CRM real conectado nesta etapa.

## Follow-up
Cadência sugerida: D+0, D+1, D+3, D+7, D+14 e eventual reativação em D+30 quando houver contexto relevante.

Follow-up deve ser contextual, não spam, e respeitar preferências de comunicação e obrigações de privacidade.

## Dados mínimos
- nome
- e-mail
- empresa/projeto, quando informado
- serviço de interesse
- origem
- estágio
- próxima ação
- observações comerciais essenciais

Não armazenar senhas, tokens, chaves privadas ou credenciais no CRM.

## Próxima evolução
Na integração real: escolher CRM, definir campos, mapear webhook/API, implementar autenticação, logs, tratamento de erros, consentimento, retenção e backup.
