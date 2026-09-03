# Etapa 5.20 — Serviços + Freelancing + Geração de Leads B2B

## Objetivo
Transformar a autoridade construída pelo conteúdo em oportunidades comerciais qualificadas para serviços digitais, sem abandonar a proposta educacional da Dejotacode.

## Posicionamento
A Dejotacode atua como parceira de execução para pequenos negócios, profissionais, criadores e projetos digitais que precisam construir, melhorar ou organizar sua presença digital.

## Serviços iniciais
- Criação de sites e blogs
- Landing pages
- Manutenção e otimização
- Consultoria em tecnologia e IA
- Automação e IA para negócios

## Funil B2B
1. Visitante
2. Interesse em serviço
3. Briefing
4. Lead qualificado
5. Diagnóstico
6. Proposta
7. Contrato
8. Entrega
9. Pós-venda, depoimento e indicação

## Qualificação
Avaliar problema, objetivo, urgência, escopo, capacidade de colaboração e aderência ao serviço antes de preparar uma proposta.

## Briefing
Campos iniciais: serviço, nome, empresa/projeto, e-mail, objetivo, prazo, faixa de investimento e consentimento.

## Eventos
`service_view`, `service_interest`, `briefing_start`, `briefing_submit`, `lead_qualified`, `discovery_call_request`, `proposal_view`, `proposal_accept`, `service_contract`, `service_completed`, `testimonial_request`, `referral_click`.

## Integração
O formulário permanece provider-neutral. A captura real deverá usar um endpoint seguro ou CRM escolhido posteriormente, com validação server-side, proteção contra spam, política de privacidade e controle de acesso.

## Segurança
- Nunca pedir senhas em formulário público.
- Não colocar segredos no frontend.
- Validar e sanitizar dados no backend.
- Aplicar rate limiting e anti-spam quando o endpoint existir.
- Formalizar escopo, critérios de aceite e responsabilidades.

## Métricas
- Visualizações da página de serviços
- Cliques de interesse
- Inícios e envios de briefing
- Taxa de qualificação
- Reuniões/diagnósticos
- Propostas enviadas
- Taxa de aceite
- Ticket médio
- Prazo médio de entrega
- Satisfação/depoimentos
- Indicações

## Próxima evolução
Conectar o briefing a um CRM ou endpoint próprio e criar automações de triagem, follow-up e proposta, sem acoplar a V1 a um fornecedor específico.
