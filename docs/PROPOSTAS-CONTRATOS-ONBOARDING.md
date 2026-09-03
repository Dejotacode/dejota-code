# Etapa 5.22 — Propostas Comerciais + Contratos + Onboarding de Clientes

## Objetivo
Transformar o pipeline comercial da Etapa 5.21 em um processo operacional completo:

**Lead → Qualificação → Diagnóstico → Proposta → Negociação → Aceite → Contrato → Onboarding → Kickoff → Execução → Entrega.**

## Proposta comercial
A proposta deve registrar:
- problema e objetivo;
- escopo e entregáveis;
- itens fora de escopo;
- cronograma e dependências;
- investimento e pagamento;
- critérios de aceite;
- validade;
- próximos passos.

A validade padrão do modelo é de 7 dias, mas pode ser alterada por projeto.

## Contrato
O modelo de dados contempla partes, objeto, escopo, prazo, pagamento, responsabilidades, mudanças de escopo, propriedade intelectual, confidencialidade, dados, rescisão e demais condições aplicáveis.

**Importante:** o projeto não fornece aconselhamento jurídico. O contrato definitivo deve ser adaptado ao caso concreto e revisado por profissional jurídico quando necessário.

## Onboarding
Checklist operacional:
1. confirmar início/pagamento;
2. enviar boas-vindas;
3. confirmar responsáveis e canal oficial;
4. solicitar materiais e acessos necessários por meio seguro;
5. validar briefing e critérios de aceite;
6. registrar primeiro marco;
7. iniciar kickoff;
8. documentar encerramento e próximos passos.

## Eventos
`proposal_created`, `proposal_sent`, `proposal_viewed`, `proposal_question`, `proposal_accepted`, `proposal_expired`, `contract_sent`, `contract_signed`, `payment_confirmed`, `onboarding_started`, `onboarding_completed`, `project_kickoff`, `project_delivered`.

## Segurança e governança
- Não solicitar senhas em formulários ou documentos.
- Não considerar visualização de proposta como aceite.
- Registrar alterações de escopo antes da execução.
- Minimizar dados pessoais.
- Usar mecanismos adequados para assinatura e pagamento quando a operação real for conectada.
- Manter modelos contratuais atualizados e revisar com profissional habilitado quando necessário.

## Integração futura
A arquitetura permanece provider-neutral. Uma futura integração poderá conectar CRM, assinatura eletrônica, pagamento, armazenamento de documentos e automações, sem colocar credenciais ou segredos no frontend.
