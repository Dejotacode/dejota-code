export const customerSuccessConfig = {
  status: 'operational-template',
  provider: 'provider-neutral',
  enabled: false,
  note: 'Feedback, depoimentos, cases e indicações estão preparados como fluxo operacional. A coleta/publicação real depende de endpoint seguro e revisão editorial.',
  principles: [
    'Pedir feedback depois de uma entrega real e em contexto adequado.',
    'Não publicar depoimentos, nomes, logos ou resultados sem autorização.',
    'Diferenciar opinião do cliente de métricas verificáveis.',
    'Não fabricar resultados; cases devem registrar contexto, solução e evidências disponíveis.',
    'Pedidos de indicação devem ser opcionais, transparentes e sem pressão.'
  ] as const
} as const;

export const feedbackDimensions = [
  { score: 1, label: 'Muito ruim' },
  { score: 2, label: 'Ruim' },
  { score: 3, label: 'Regular' },
  { score: 4, label: 'Bom' },
  { score: 5, label: 'Excelente' }
] as const;

export const feedbackQuestions = [
  'O objetivo do projeto ficou claro para você?',
  'Como você avalia a comunicação durante o projeto?',
  'Como você avalia a qualidade da entrega?',
  'A solução atendeu ao objetivo combinado?',
  'O que poderíamos melhorar no próximo projeto?'
] as const;

export const testimonialRules = [
  'Solicitar autorização explícita antes de publicar o depoimento.',
  'Confirmar nome, cargo/empresa e contexto que poderão ser exibidos.',
  'Permitir que o cliente revise a versão final quando necessário.',
  'Não editar uma fala de modo a mudar seu sentido.',
  'Remover ou anonimizar informações que o cliente não autorizou.'
] as const;

export const caseStudyStructure = [
  { step: '01', name: 'Contexto', goal: 'Explicar quem era o cliente e qual situação motivou o projeto.' },
  { step: '02', name: 'Problema', goal: 'Descrever o desafio sem expor dados confidenciais.' },
  { step: '03', name: 'Solução', goal: 'Mostrar o que foi construído ou executado.' },
  { step: '04', name: 'Processo', goal: 'Apresentar decisões, marcos e aprendizados relevantes.' },
  { step: '05', name: 'Resultado', goal: 'Usar métricas ou evidências reais quando disponíveis.' },
  { step: '06', name: 'Aprendizado', goal: 'Transformar o projeto em conhecimento útil para o público.' }
] as const;

export const caseStudyChecklist = [
  'Objetivo e período do projeto definidos.',
  'Escopo e solução documentados.',
  'Métricas diferenciadas de estimativas ou percepções.',
  'Informações confidenciais removidas ou autorizadas.',
  'Depoimento aprovado pelo cliente quando utilizado.',
  'Imagens, logos e materiais com autorização de uso.',
  'CTA contextual para serviço ou conteúdo relacionado.'
] as const;

export const referralFlow = [
  { step: '01', name: 'Experiência', goal: 'Concluir uma entrega adequada e confirmar satisfação.' },
  { step: '02', name: 'Convite', goal: 'Apresentar a possibilidade de indicar alguém, sem pressão.' },
  { step: '03', name: 'Contexto', goal: 'Explicar claramente que tipo de projeto ou cliente é adequado.' },
  { step: '04', name: 'Introdução', goal: 'Receber contato ou apresentação voluntária.' },
  { step: '05', name: 'CRM', goal: 'Registrar origem, contexto e consentimentos necessários.' },
  { step: '06', name: 'Agradecimento', goal: 'Agradecer a indicação independentemente do resultado comercial.' }
] as const;

export const customerSuccessEvents = [
  'feedback_started',
  'feedback_submitted',
  'satisfaction_recorded',
  'testimonial_requested',
  'testimonial_authorized',
  'testimonial_published',
  'case_created',
  'case_published',
  'referral_invited',
  'referral_received',
  'referral_qualified',
  'referral_converted'
] as const;

export const customerSuccessMetrics = [
  'Taxa de resposta ao feedback',
  'Satisfação média por projeto',
  'NPS quando houver metodologia definida',
  'Taxa de autorização de depoimentos',
  'Cases publicados e atualizados',
  'Indicações recebidas',
  'Indicações qualificadas',
  'Conversão de indicação em cliente',
  'Receita influenciada por indicação'
] as const;
