export const services = [
  {
    slug: 'sites-e-blogs',
    name: 'Criação de Sites e Blogs',
    short: 'Sites rápidos, responsivos e preparados para conteúdo, SEO e crescimento.',
    audience: 'Pequenas empresas, profissionais, criadores e projetos digitais.',
    deliverables: ['Arquitetura e páginas', 'Layout responsivo', 'SEO técnico inicial', 'Publicação e orientação'],
    model: 'Projeto fechado',
    priority: 'Alta'
  },
  {
    slug: 'landing-pages',
    name: 'Landing Pages',
    short: 'Páginas focadas em uma oferta, campanha, captura de leads ou lançamento.',
    audience: 'Negócios digitais, freelancers, afiliados e pequenos negócios.',
    deliverables: ['Estrutura de conversão', 'Copy orientada à ação', 'Página responsiva', 'Medição preparada'],
    model: 'Projeto fechado',
    priority: 'Alta'
  },
  {
    slug: 'manutencao-otimizacao',
    name: 'Manutenção e Otimização',
    short: 'Correções, melhorias de performance, SEO, conteúdo e experiência do usuário.',
    audience: 'Quem já possui site e quer melhorar estabilidade, velocidade ou conversão.',
    deliverables: ['Diagnóstico', 'Correções priorizadas', 'Otimizações', 'Relatório de entrega'],
    model: 'Projeto ou recorrência',
    priority: 'Média'
  },
  {
    slug: 'consultoria-tech-ia',
    name: 'Consultoria em Tech e IA',
    short: 'Diagnóstico prático para escolher ferramentas, organizar processos e aplicar IA com objetivo claro.',
    audience: 'Pequenos negócios, profissionais e equipes enxutas.',
    deliverables: ['Diagnóstico', 'Mapa de oportunidades', 'Recomendações', 'Plano de ação'],
    model: 'Consultoria',
    priority: 'Média'
  },
  {
    slug: 'automacao-para-negocios',
    name: 'Automação e IA para Negócios',
    short: 'Estruturas simples para reduzir tarefas repetitivas e criar processos digitais mais eficientes.',
    audience: 'Pequenas empresas e profissionais com processos manuais repetitivos.',
    deliverables: ['Mapeamento do processo', 'Desenho da solução', 'Protótipo ou implementação', 'Documentação'],
    model: 'Projeto sob diagnóstico',
    priority: 'Média'
  }
] as const;

export const idealClientCriteria = [
  'Tem um problema digital concreto e prioridade definida.',
  'Consegue explicar objetivo, público e resultado esperado.',
  'Está disposto a fornecer acessos, materiais e feedback necessários.',
  'Valoriza clareza, documentação e comunicação durante o projeto.',
  'Entende que escopo, prazo e investimento precisam ser definidos antes da execução.'
] as const;

export const leadPipeline = [
  { stage: 'Visitante', goal: 'Descobrir uma necessidade e conhecer a Dejotacode.' },
  { stage: 'Interesse', goal: 'Identificar um serviço adequado ao problema.' },
  { stage: 'Briefing', goal: 'Coletar contexto, objetivo, prazo e orçamento indicativo.' },
  { stage: 'Qualificado', goal: 'Confirmar aderência, prioridade e capacidade de execução.' },
  { stage: 'Diagnóstico', goal: 'Entender o problema e definir escopo possível.' },
  { stage: 'Proposta', goal: 'Apresentar escopo, prazo, investimento e condições.' },
  { stage: 'Contrato', goal: 'Formalizar responsabilidades e iniciar o projeto.' },
  { stage: 'Entrega', goal: 'Executar, revisar, documentar e concluir.' },
  { stage: 'Pós-venda', goal: 'Coletar feedback, resultado, depoimento e indicação.' }
] as const;

export const serviceEvents = [
  'service_view',
  'service_interest',
  'briefing_start',
  'briefing_submit',
  'lead_qualified',
  'discovery_call_request',
  'proposal_view',
  'proposal_accept',
  'service_contract',
  'service_completed',
  'testimonial_request',
  'referral_click'
] as const;

export const serviceRules = [
  'Não prometer resultados financeiros ou técnicos que dependam de fatores externos.',
  'Definir escopo e critérios de aceite antes do início.',
  'Separar o que está incluído do que será orçamento adicional.',
  'Registrar decisões, acessos e entregas importantes.',
  'Não solicitar senhas por formulários públicos; usar meios seguros quando acessos forem necessários.',
  'Só publicar depoimentos ou estudos de caso com autorização.'
] as const;
