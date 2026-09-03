# Etapa 5.23 — Gestão de Projetos + Entregas + Pós-venda

## Objetivo
Fechar o ciclo operacional iniciado no CRM, transformando um contrato em um projeto executável e uma entrega em relacionamento de longo prazo.

## Fluxo
Lead → CRM → Qualificação → Diagnóstico → Proposta → Negociação → Aceite → Contrato → Onboarding → Planejamento → Kickoff → Execução → Revisão → Aceite → Encerramento → Feedback → Depoimento → Indicação → Reativação.

## Gestão do projeto
Cada projeto deve ter:
- objetivo e escopo;
- responsáveis;
- prazo e marcos;
- tarefas;
- critérios de aceite;
- registro de decisões;
- controle de alterações de escopo;
- documentação final.

## Entregas
Antes de solicitar aceite:
1. conferir entregáveis contratados;
2. validar arquivos, links e instruções;
3. registrar o que foi entregue;
4. separar pendências e itens fora do escopo;
5. solicitar aceite pelo canal oficial;
6. arquivar a versão final conforme a política aplicável.

Silêncio não deve ser tratado automaticamente como aprovação.

## Pós-venda
Cadência operacional:
- D+0: confirmação da entrega;
- D+1: checagem de acesso/uso;
- D+3: feedback;
- D+7: oportunidade de melhoria ou próximo projeto;
- D+14: depoimento, somente com autorização;
- D+30: reativação com contexto relevante.

## Eventos
`project_created`, `project_planned`, `project_kickoff`, `task_created`, `task_completed`, `milestone_reached`, `delivery_sent`, `revision_requested`, `acceptance_requested`, `delivery_accepted`, `project_completed`, `feedback_requested`, `testimonial_requested`, `referral_requested`, `reactivation_started`.

## Segurança e governança
Não solicitar senhas em formulários públicos ou e-mail. Compartilhar acessos somente quando necessários e por canal seguro. Minimizar dados pessoais e respeitar finalidade, retenção e solicitações de privacidade. Depoimentos, logos e estudos de caso dependem de autorização apropriada.

## Integração futura
A arquitetura permanece provider-neutral. Uma integração futura pode conectar CRM, gestão de tarefas, armazenamento, assinatura e comunicação, mantendo o site público desacoplado dessas ferramentas.
