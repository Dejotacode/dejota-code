export const crmConfig = {
  provider: 'provider-neutral',
  enabled: false,
  note: 'A integração real com CRM permanece desativada até a escolha de um provedor e endpoint seguro.',
  stages: [
    { id: 'novo', name: 'Novo lead', goal: 'Registrar origem, interesse e contexto inicial.' },
    { id: 'qualificacao', name: 'Qualificação', goal: 'Confirmar problema, aderência, prazo e capacidade.' },
    { id: 'diagnostico', name: 'Diagnóstico', goal: 'Aprofundar necessidade e definir escopo possível.' },
    { id: 'proposta', name: 'Proposta enviada', goal: 'Apresentar escopo, prazo, investimento e condições.' },
    { id: 'negociacao', name: 'Negociação', goal: 'Resolver dúvidas e ajustar condições sem perder o escopo.' },
    { id: 'fechado', name: 'Fechado ganho', goal: 'Formalizar contratação e iniciar onboarding.' },
    { id: 'perdido', name: 'Fechado perdido', goal: 'Registrar motivo e preservar possibilidade de reativação.' },
    { id: 'pos_venda', name: 'Pós-venda', goal: 'Acompanhar resultado, feedback, depoimento e indicação.' }
  ] as const
} as const;

export const qualification = {
  score: [
    { criterion: 'Problema claro', points: 20 },
    { criterion: 'Urgência/prioridade', points: 15 },
    { criterion: 'Aderência ao serviço', points: 20 },
    { criterion: 'Prazo compatível', points: 15 },
    { criterion: 'Investimento compatível', points: 20 },
    { criterion: 'Decisor ou acesso ao decisor', points: 10 }
  ] as const,
  bands: [
    { name: 'Alta prioridade', min: 75, action: 'Agendar diagnóstico.' },
    { name: 'Média prioridade', min: 50, action: 'Nutrir e esclarecer antes do diagnóstico.' },
    { name: 'Baixa prioridade', min: 0, action: 'Enviar recurso útil e manter relacionamento.' }
  ] as const
} as const;

export const automations = [
  { trigger: 'briefing_submit', action: 'Criar lead e registrar origem/serviço.' },
  { trigger: 'lead_qualified', action: 'Mover para diagnóstico e criar tarefa de follow-up.' },
  { trigger: 'proposal_view', action: 'Registrar interesse na proposta.' },
  { trigger: 'proposal_accept', action: 'Mover para fechado ganho e iniciar onboarding.' },
  { trigger: 'proposal_no_response', action: 'Criar follow-up sem pressionar o lead.' },
  { trigger: 'service_completed', action: 'Iniciar sequência de feedback e indicação.' }
] as const;

export const crmEvents = [
  'crm_lead_created',
  'crm_stage_changed',
  'crm_followup_created',
  'crm_followup_completed',
  'crm_diagnosis_scheduled',
  'crm_proposal_sent',
  'crm_proposal_viewed',
  'crm_proposal_accepted',
  'crm_deal_won',
  'crm_deal_lost',
  'crm_reactivation',
  'crm_post_sale'
] as const;

export const followUpSequence = [
  { day: 'D+0', action: 'Confirmar recebimento e revisar briefing.' },
  { day: 'D+1', action: 'Fazer triagem e solicitar somente informações essenciais.' },
  { day: 'D+3', action: 'Se qualificado, convidar para diagnóstico.' },
  { day: 'D+7', action: 'Se proposta enviada, fazer follow-up objetivo.' },
  { day: 'D+14', action: 'Último follow-up da sequência ativa.' },
  { day: 'D+30', action: 'Reativar apenas quando houver motivo ou novo contexto relevante.' }
] as const;

export const crmRules = [
  'Registrar origem e serviço de interesse para medir quais canais geram oportunidades.',
  'Nunca considerar um clique ou abertura como aprovação de proposta.',
  'Não enviar spam: cada follow-up deve ter contexto e opção clara de não continuar.',
  'Minimizar dados pessoais e respeitar finalidade, retenção e solicitações de privacidade.',
  'Não armazenar senhas, tokens ou credenciais no CRM ou formulário público.',
  'Registrar motivo de perda para melhorar oferta, qualificação e processo comercial.'
] as const;
