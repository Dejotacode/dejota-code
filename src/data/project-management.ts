export const projectConfig = {
  status: 'operational-template',
  provider: 'provider-neutral',
  enabled: false,
  note: 'A gestão real permanece provider-neutral nesta etapa. A arquitetura está pronta para receber tarefas, marcos, arquivos e status em uma ferramenta externa ou backend futuro.',
  principles: [
    'Todo projeto começa com escopo, responsáveis, prazo e critérios de aceite registrados.',
    'Cada entrega deve ter um marco verificável e uma próxima ação definida.',
    'Alterações de escopo entram como solicitação registrada antes da execução.',
    'Acessos e arquivos sensíveis devem ser compartilhados por canais seguros e somente quando necessários.',
    'O encerramento só acontece após entrega, aceite ou registro formal da pendência.'
  ] as const
} as const;

export const projectStages = [
  { id: 'planejamento', name: 'Planejamento', goal: 'Converter contrato e briefing em plano executável.', deliverable: 'Plano do projeto' },
  { id: 'kickoff', name: 'Kickoff', goal: 'Alinhar objetivos, responsáveis, canais e primeiro marco.', deliverable: 'Registro de kickoff' },
  { id: 'execucao', name: 'Execução', goal: 'Produzir tarefas e entregas dentro do escopo aprovado.', deliverable: 'Tarefas concluídas' },
  { id: 'revisao', name: 'Revisão', goal: 'Validar a entrega contra critérios previamente definidos.', deliverable: 'Rodada de revisão' },
  { id: 'aceite', name: 'Aceite', goal: 'Registrar aprovação, pendência ou ajuste previsto em contrato.', deliverable: 'Aceite registrado' },
  { id: 'encerramento', name: 'Encerramento', goal: 'Entregar documentação, orientações e próximos passos.', deliverable: 'Pacote final' }
] as const;

export const projectMilestones = [
  { name: 'Escopo validado', owner: 'Dejotacode + cliente', checkpoint: 'Objetivo, entregáveis e limites confirmados.' },
  { name: 'Kickoff concluído', owner: 'Responsável pelo projeto', checkpoint: 'Canais, responsáveis e cronograma alinhados.' },
  { name: 'Primeira entrega', owner: 'Dejotacode', checkpoint: 'Primeiro resultado verificável apresentado.' },
  { name: 'Revisão', owner: 'Cliente', checkpoint: 'Feedback consolidado dentro do escopo contratado.' },
  { name: 'Aceite final', owner: 'Cliente', checkpoint: 'Entrega aprovada ou pendências formalmente registradas.' }
] as const;

export const deliveryChecklist = [
  'Conferir todos os entregáveis previstos no contrato.',
  'Validar links, arquivos, acessos e instruções de uso.',
  'Registrar o que foi entregue e eventuais itens fora do escopo.',
  'Solicitar aceite pelo canal oficial definido no projeto.',
  'Guardar documentação e versão final conforme a política de retenção.',
  'Enviar orientações de continuidade e manutenção quando aplicável.'
] as const;

export const postSaleSequence = [
  { day: 'D+0', action: 'Confirmar entrega e enviar instruções finais.' },
  { day: 'D+1', action: 'Verificar se o cliente conseguiu acessar e utilizar a entrega.' },
  { day: 'D+3', action: 'Solicitar feedback objetivo sobre resultado e experiência.' },
  { day: 'D+7', action: 'Identificar oportunidade de melhoria, suporte ou próximo projeto.' },
  { day: 'D+14', action: 'Pedir depoimento somente com autorização e contexto adequado.' },
  { day: 'D+30', action: 'Reativar com uma recomendação ou nova necessidade relevante.' }
] as const;

export const projectEvents = [
  'project_created',
  'project_planned',
  'project_kickoff',
  'task_created',
  'task_completed',
  'milestone_reached',
  'delivery_sent',
  'revision_requested',
  'acceptance_requested',
  'delivery_accepted',
  'project_completed',
  'feedback_requested',
  'testimonial_requested',
  'referral_requested',
  'reactivation_started'
] as const;

export const postSaleRules = [
  'Não considerar silêncio como aceite; registrar aprovação ou pendência de forma adequada.',
  'Feedback não deve ser usado para criar escopo adicional sem nova aprovação.',
  'Depoimentos e logos de clientes só devem ser publicados com autorização.',
  'Pedidos de indicação devem ocorrer depois de uma experiência de entrega adequada.',
  'Reativação deve ter contexto real e não virar spam.',
  'Manter dados e arquivos somente pelo período necessário e conforme obrigações aplicáveis.'
] as const;
