export const dashboardConfig = {
  provider: 'provider-neutral',
  enabled: false,
  note: 'O dashboard funciona como camada de definição e visualização. Dados reais dependem da conexão de analytics, CRM, vendas e projetos.',
  refresh: 'manual-or-provider',
  defaultPeriod: 'Últimos 30 dias'
} as const;

export const kpis = [
  { id: 'traffic', name: 'Sessões', group: 'Aquisição', definition: 'Número de sessões no período.', formula: 'sessions', target: 'Crescimento sustentável mês a mês.' },
  { id: 'engagement', name: 'Engajamento', group: 'Conteúdo', definition: 'Qualidade da interação com o conteúdo.', formula: 'engaged sessions / sessions', target: 'Acompanhar tendência e comparar páginas.' },
  { id: 'lead-rate', name: 'Taxa de conversão em lead', group: 'Captura', definition: 'Percentual de sessões que geram um lead.', formula: 'leads / sessions × 100', target: 'Otimizar por página, origem e CTA.' },
  { id: 'qualified-rate', name: 'Taxa de qualificação', group: 'CRM', definition: 'Percentual de leads considerados qualificados.', formula: 'qualified leads / leads × 100', target: 'Melhorar aquisição e triagem.' },
  { id: 'proposal-rate', name: 'Taxa de proposta', group: 'Vendas', definition: 'Percentual de leads qualificados que recebem proposta.', formula: 'proposals / qualified leads × 100', target: 'Medir eficiência do diagnóstico.' },
  { id: 'win-rate', name: 'Taxa de fechamento', group: 'Vendas', definition: 'Percentual de propostas aceitas.', formula: 'won deals / proposals × 100', target: 'Aumentar com oferta e processo melhores.' },
  { id: 'ticket', name: 'Ticket médio', group: 'Receita', definition: 'Valor médio dos negócios ganhos.', formula: 'revenue / won deals', target: 'Acompanhar mix e rentabilidade.' },
  { id: 'delivery', name: 'Entrega no prazo', group: 'Operação', definition: 'Projetos entregues dentro do prazo acordado.', formula: 'on-time projects / completed projects × 100', target: 'Manter previsibilidade operacional.' },
  { id: 'satisfaction', name: 'Satisfação média', group: 'Pós-venda', definition: 'Média das avaliações recebidas.', formula: 'sum ratings / responses', target: 'Identificar melhorias e gerar prova social.' },
  { id: 'referral', name: 'Conversão por indicação', group: 'Crescimento', definition: 'Percentual de indicações que viram negócios ganhos.', formula: 'won referrals / referrals × 100', target: 'Transformar satisfação em crescimento.' }
] as const;

export const funnel = [
  { stage: 'Sessões', event: 'page_view', metric: 'sessions' },
  { stage: 'Interesse', event: 'cta_click', metric: 'cta_clicks' },
  { stage: 'Lead', event: 'newsletter_submit / briefing_submit', metric: 'leads' },
  { stage: 'Lead qualificado', event: 'lead_qualified', metric: 'qualified_leads' },
  { stage: 'Proposta', event: 'proposal_sent', metric: 'proposals' },
  { stage: 'Venda', event: 'crm_deal_won', metric: 'won_deals' },
  { stage: 'Projeto concluído', event: 'project_completed', metric: 'completed_projects' },
  { stage: 'Indicação', event: 'referral_received', metric: 'referrals' }
] as const;

export const dashboards = [
  { name: 'Executivo', purpose: 'Visão rápida de aquisição, vendas, receita, operação e satisfação.', cards: ['Sessões', 'Leads', 'Taxa de fechamento', 'Receita', 'Ticket médio', 'Satisfação'] },
  { name: 'Marketing & Conteúdo', purpose: 'Descobrir quais conteúdos e canais geram atenção e leads.', cards: ['Sessões', 'Top páginas', 'Engajamento', 'CTA CTR', 'Leads por origem', 'Downloads'] },
  { name: 'Comercial', purpose: 'Acompanhar o pipeline e a eficiência de conversão.', cards: ['Leads', 'Qualificados', 'Propostas', 'Negociações', 'Ganhos', 'Ticket médio'] },
  { name: 'Operação', purpose: 'Controlar projetos, prazos, entregas e capacidade.', cards: ['Projetos ativos', 'Marcos', 'Atrasos', 'Entrega no prazo', 'Revisões', 'Projetos concluídos'] },
  { name: 'Customer Success', purpose: 'Medir satisfação, prova social, indicações e reativação.', cards: ['Avaliações', 'Satisfação', 'Depoimentos autorizados', 'Cases', 'Indicações', 'Reativações'] }
] as const;

export const dimensions = [
  'Período', 'Origem do tráfego', 'Campanha', 'Página de entrada', 'Categoria', 'Artigo', 'CTA', 'Serviço', 'Produto', 'Etapa do CRM', 'Projeto', 'Cliente'
] as const;

export const events = [
  'page_view', 'cta_click', 'lead_magnet_download', 'newsletter_submit', 'briefing_submit',
  'lead_qualified', 'crm_proposal_sent', 'crm_proposal_viewed', 'crm_proposal_accepted',
  'crm_deal_won', 'crm_deal_lost', 'project_created', 'project_kickoff', 'delivery_sent',
  'delivery_accepted', 'project_completed', 'feedback_submitted', 'testimonial_authorized',
  'case_published', 'referral_received', 'referral_converted'
] as const;

export const governance = [
  'Não inventar dados: quando não houver integração, mostrar estado “sem dados” ou “demonstração”.',
  'Definir cada KPI antes de acompanhar metas para evitar interpretações diferentes.',
  'Separar métricas de vaidade de indicadores que orientam decisões.',
  'Usar períodos comparáveis e registrar mudanças importantes no site ou no processo.',
  'Minimizar dados pessoais e aplicar finalidade, retenção e controles de acesso.',
  'Revisar o dashboard em ciclos regulares e transformar desvios em ações concretas.'
] as const;
