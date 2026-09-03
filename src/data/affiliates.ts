export const affiliateStrategy = {
  principle: 'Recomendar apenas ferramentas, produtos e serviços relevantes para o contexto do conteúdo e com critérios editoriais claros.',
  disclosure: 'Alguns links podem ser de afiliado. Se você comprar por eles, a Dejotacode pode receber uma comissão, sem custo adicional para você.',
  funnel: [
    { step: 1, name: 'Conteúdo', goal: 'Responder uma dúvida real e gerar confiança.' },
    { step: 2, name: 'Contexto', goal: 'Explicar quando uma ferramenta ou serviço faz sentido.' },
    { step: 3, name: 'Recomendação', goal: 'Apresentar critérios, alternativas e limitações.' },
    { step: 4, name: 'Clique', goal: 'Levar ao site oficial com rastreamento transparente.' },
    { step: 5, name: 'Conversão', goal: 'Permitir que a pessoa decida no ambiente do fornecedor.' },
    { step: 6, name: 'Análise', goal: 'Medir cliques e qualidade da recomendação.' }
  ] as const
} as const;

export const affiliateCategories = [
  { id: 'hosting', name: 'Hospedagem e infraestrutura', audience: 'Quem quer publicar sites e projetos.', criteria: ['estabilidade', 'suporte', 'preço total', 'recursos', 'facilidade para iniciantes'] },
  { id: 'development', name: 'Ferramentas de desenvolvimento', audience: 'Quem programa ou constrói projetos web.', criteria: ['produtividade', 'documentação', 'integrações', 'limitações', 'custo-benefício'] },
  { id: 'ai', name: 'Ferramentas de IA', audience: 'Criadores, freelancers e pequenos negócios.', criteria: ['utilidade prática', 'privacidade', 'limites', 'qualidade', 'preço'] },
  { id: 'business', name: 'Ferramentas para negócios digitais', audience: 'Afiliados, freelancers e pequenos negócios.', criteria: ['facilidade', 'automação', 'suporte', 'custo', 'adequação ao cenário'] }
] as const;

export const recommendationRules = [
  'Deixar claro quando existe relação de afiliado.',
  'Não inventar experiência pessoal, testes ou resultados.',
  'Separar opinião editorial de informação fornecida pelo fabricante.',
  'Comparar alternativas quando isso ajudar a decisão.',
  'Informar limitações, custos recorrentes e condições relevantes.',
  'Preferir links oficiais e evitar redirecionamentos obscuros.',
  'Não recomendar apenas porque existe comissão.',
  'Atualizar recomendações quando preço, produto ou condições mudarem.'
] as const;

export const affiliateEvents = [
  'affiliate_impression', 'affiliate_view', 'affiliate_click', 'affiliate_outbound',
  'affiliate_conversion', 'affiliate_update', 'recommendation_feedback'
] as const;

export const plannedRecommendations = [
  { id: 'site-publicacao', title: 'Ferramentas para publicar um site', category: 'hosting', articlePath: '/blog/tutoriais-guias/publicar-site/', status: 'planejado' },
  { id: 'ia-ferramentas', title: 'Ferramentas de IA para trabalho', category: 'ai', articlePath: '/blog/ia/ia-para-iniciantes/', status: 'planejado' },
  { id: 'dev-ferramentas', title: 'Ferramentas para desenvolvimento web', category: 'development', articlePath: '/blog/programacao/primeiros-passos-web/', status: 'planejado' },
  { id: 'negocio-digital', title: 'Ferramentas para negócios digitais', category: 'business', articlePath: '/blog/renda-digital/primeiro-freelance/', status: 'planejado' }
] as const;
