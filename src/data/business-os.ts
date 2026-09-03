export const businessOSConfig = {
  name: 'Dejotacode Business OS',
  provider: 'provider-neutral',
  enabled: false,
  note: 'Centro de operações arquitetural. As integrações reais permanecem desligadas até a conexão segura de CRM, analytics, projetos, financeiro e automações.',
  sourceOfTruth: 'Cada domínio mantém seu contexto; o Business OS organiza o fluxo, eventos, responsabilidades e indicadores sem duplicar dados desnecessariamente.'
} as const;

export const osModules = [
  { id: 'marketing', name: 'Marketing & Conteúdo', owner: 'Aquisição', input: 'Tráfego, campanhas, conteúdo e CTAs', output: 'Interesse e leads' },
  { id: 'crm', name: 'CRM & Vendas', owner: 'Comercial', input: 'Leads e briefings', output: 'Diagnósticos, propostas e negócios' },
  { id: 'contracts', name: 'Contratos & Onboarding', owner: 'Administrativo', input: 'Negócios ganhos', output: 'Cliente pronto para execução' },
  { id: 'projects', name: 'Projetos & Entregas', owner: 'Operação', input: 'Escopo contratado', output: 'Entrega e aceite' },
  { id: 'success', name: 'Customer Success', owner: 'Relacionamento', input: 'Entrega e experiência', output: 'Feedback, depoimentos e retenção' },
  { id: 'referrals', name: 'Indicações & Crescimento', owner: 'Growth', input: 'Clientes satisfeitos', output: 'Novos leads' },
  { id: 'bi', name: 'BI & KPIs', owner: 'Gestão', input: 'Eventos e indicadores', output: 'Decisões e prioridades' },
  { id: 'finance', name: 'Financeiro', owner: 'Gestão', input: 'Vendas, custos e recebimentos', output: 'Margem, caixa e previsibilidade' }
] as const;

export const operatingFlow = [
  { step: '01', name: 'Atrair', detail: 'Conteúdo, SEO, redes, afiliados e campanhas.' },
  { step: '02', name: 'Capturar', detail: 'Newsletter, materiais gratuitos, briefing e contato.' },
  { step: '03', name: 'Qualificar', detail: 'CRM, score, contexto e prioridade.' },
  { step: '04', name: 'Vender', detail: 'Diagnóstico, proposta, negociação e aceite.' },
  { step: '05', name: 'Iniciar', detail: 'Contrato, pagamento e onboarding.' },
  { step: '06', name: 'Executar', detail: 'Planejamento, tarefas, marcos e revisões.' },
  { step: '07', name: 'Entregar', detail: 'Entrega, aceite, documentação e encerramento.' },
  { step: '08', name: 'Expandir', detail: 'Feedback, case, indicação, retenção e reativação.' },
  { step: '09', name: 'Otimizar', detail: 'BI, KPIs, aprendizados e novas prioridades.' }
] as const;

export const cadences = [
  { cadence: 'Diária', focus: 'Leads, tarefas bloqueadas, entregas críticas e follow-ups.' },
  { cadence: 'Semanal', focus: 'Pipeline, projetos, conteúdo, conversões e prioridades.' },
  { cadence: 'Mensal', focus: 'Receita, margem, aquisição, satisfação, retenção e metas.' },
  { cadence: 'Trimestral', focus: 'Estratégia, portfólio, canais, processos e roadmap.' }
] as const;

export const commandCenter = [
  { area: 'Comercial', questions: ['Quantos leads estão ativos?', 'Quais oportunidades estão paradas?', 'Qual o próximo follow-up?'] },
  { area: 'Operação', questions: ['Quais projetos estão em risco?', 'Qual marco vem a seguir?', 'O que depende do cliente?'] },
  { area: 'Marketing', questions: ['Qual conteúdo gera leads?', 'Quais CTAs convertem?', 'Qual canal merece investimento?'] },
  { area: 'Financeiro', questions: ['Quanto foi vendido?', 'Quanto foi recebido?', 'Qual a margem e o caixa previsto?'] },
  { area: 'Relacionamento', questions: ['Quem precisa de acompanhamento?', 'Quais clientes podem indicar?', 'Quais feedbacks viraram melhoria?'] }
] as const;

export const governance = [
  'Definir responsável por cada processo e indicador.',
  'Manter uma única fonte de verdade para cada dado crítico.',
  'Registrar decisões importantes e mudanças de escopo.',
  'Evitar automações que enviem mensagens sem contexto ou consentimento.',
  'Minimizar dados pessoais e limitar acesso conforme a função.',
  'Separar ambiente público do site de dados operacionais e financeiros.',
  'Medir antes de automatizar: processos ruins não ficam melhores apenas porque foram automatizados.',
  'Revisar automações, integrações e permissões periodicamente.'
] as const;

export const automationRules = [
  { trigger: 'lead_created', action: 'Criar tarefa de qualificação e registrar origem.' },
  { trigger: 'deal_won', action: 'Criar onboarding, projeto e checklist financeiro.' },
  { trigger: 'onboarding_completed', action: 'Liberar kickoff e plano de execução.' },
  { trigger: 'milestone_reached', action: 'Atualizar projeto e preparar comunicação contextual.' },
  { trigger: 'delivery_accepted', action: 'Encerrar projeto e iniciar pós-venda.' },
  { trigger: 'feedback_submitted', action: 'Registrar satisfação e identificar oportunidade de melhoria.' },
  { trigger: 'referral_received', action: 'Criar novo lead vinculado à origem da indicação.' },
  { trigger: 'kpi_deviation', action: 'Criar alerta para análise e decisão, sem alterar dados automaticamente.' }
] as const;

export const osEvents = [
  'os_lead_created', 'os_deal_won', 'os_onboarding_started', 'os_project_started',
  'os_milestone_reached', 'os_delivery_accepted', 'os_project_completed',
  'os_feedback_received', 'os_testimonial_authorized', 'os_case_published',
  'os_referral_received', 'os_revenue_recorded', 'os_kpi_deviation', 'os_action_created', 'os_action_completed'
] as const;
