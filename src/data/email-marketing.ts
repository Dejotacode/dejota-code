export const emailSequences = [
  {
    id: 'boas-vindas',
    name: 'Boas-vindas',
    trigger: 'newsletter_subscribe',
    goal: 'Confirmar a inscrição, entregar valor imediato e orientar o próximo passo.',
    emails: [
      { day: 0, subject: 'Bem-vindo à Dejotacode 👋', purpose: 'Entrega e expectativa', cta: '/comece-aqui/' },
      { day: 1, subject: 'Por onde começar na sua jornada digital', purpose: 'Orientação', cta: '/comece-aqui/' },
      { day: 3, subject: 'Escolha um projeto pequeno e construa', purpose: 'Ativação', cta: '/projetos/' },
      { day: 5, subject: 'Como transformar aprendizado em prática', purpose: 'Educação', cta: '/tutoriais-guias/' },
      { day: 7, subject: 'Seu próximo passo', purpose: 'Conversão suave', cta: '/newsletter/' }
    ]
  },
  {
    id: 'renda-digital',
    name: 'Renda Digital',
    trigger: 'segment_renda_digital',
    goal: 'Ajudar iniciantes a sair da ideia para uma primeira ação concreta.',
    emails: [
      { day: 0, subject: 'Comece pequeno: sua primeira ação', purpose: 'Ativação', cta: '/renda-digital/' },
      { day: 2, subject: '3 caminhos para começar sem complicar', purpose: 'Educação', cta: '/renda-digital/' },
      { day: 4, subject: 'O erro que trava quem está começando', purpose: 'Objeção', cta: '/blog/blog/renda-digital/primeiro-freelance/' },
      { day: 7, subject: 'Transforme habilidade em oferta', purpose: 'Oferta', cta: '/contato/' }
    ]
  },
  {
    id: 'programacao',
    name: 'Programação',
    trigger: 'segment_programacao',
    goal: 'Levar o iniciante de fundamentos para um primeiro projeto publicado.',
    emails: [
      { day: 0, subject: 'Seu primeiro projeto começa aqui', purpose: 'Ativação', cta: '/programacao/' },
      { day: 2, subject: 'O caminho mais simples para aprender web', purpose: 'Educação', cta: '/blog/blog/programacao/primeiros-passos-web/' },
      { day: 5, subject: 'Construa antes de tentar aprender tudo', purpose: 'Ativação', cta: '/projetos/' },
      { day: 8, subject: 'Publique seu projeto', purpose: 'Resultado', cta: '/blog/tutoriais-guias/publicar-site/' }
    ]
  },
  {
    id: 'ia',
    name: 'IA na prática',
    trigger: 'segment_ia',
    goal: 'Ensinar usos práticos de IA sem transformar a newsletter em conteúdo genérico.',
    emails: [
      { day: 0, subject: 'IA sem complicação: comece por uma tarefa', purpose: 'Ativação', cta: '/ia/' },
      { day: 2, subject: 'Como escrever prompts mais úteis', purpose: 'Educação', cta: '/blog/blog/ia/ia-para-iniciantes/' },
      { day: 5, subject: 'Use IA para acelerar, não para substituir seu aprendizado', purpose: 'Confiança', cta: '/ia/' },
      { day: 8, subject: 'Seu próximo experimento com IA', purpose: 'Ativação', cta: '/ia/' }
    ]
  }
] as const;

export const emailLifecycle = [
  { id: 'subscriber', name: 'Inscrito', description: 'Entrou na lista e confirmou o consentimento.' },
  { id: 'engaged', name: 'Engajado', description: 'Abre ou clica nos conteúdos com frequência.' },
  { id: 'lead', name: 'Lead', description: 'Demonstra interesse em material, serviço ou produto.' },
  { id: 'customer', name: 'Cliente', description: 'Realizou uma compra ou contratação.' },
  { id: 'inactive', name: 'Inativo', description: 'Não demonstra interação durante o período definido.' }
] as const;

export const emailEvents = [
  'email_subscribed', 'email_confirmed', 'email_sent', 'email_opened', 'email_clicked',
  'email_unsubscribed', 'email_bounced', 'email_complaint', 'sequence_started', 'sequence_completed'
] as const;

export const emailMetrics = [
  'taxa de entrega', 'taxa de abertura', 'taxa de clique', 'inscrições',
  'descadastros', 'reclamações', 'conversão por sequência', 'receita por assinante'
] as const;

export const automationRules = [
  'Novo inscrito → sequência de boas-vindas',
  'Segmento definido → sequência específica da categoria',
  'Clique em oferta → marcar intenção comercial',
  'Compra/contratação → sair de sequências de aquisição',
  'Descadastro → interromper imediatamente todos os envios',
  'Bounce ou reclamação → bloquear novos envios até tratamento',
  'Inatividade → fluxo de reengajamento antes de remover da lista'
] as const;
