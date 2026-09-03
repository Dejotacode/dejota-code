export const digitalProducts = [
  {
    id: 'primeira-renda-digital',
    name: 'Primeira Renda Digital',
    format: 'E-book + checklist',
    audience: 'Iniciantes que querem transformar uma habilidade em uma primeira oferta.',
    promise: 'Um caminho simples para escolher uma habilidade, criar uma oferta e dar os primeiros passos para vender online.',
    priceModel: 'baixo ticket',
    status: 'planejado',
    cta: 'Conhecer o produto',
    href: '/contato/'
  },
  {
    id: 'site-do-zero',
    name: 'Site do Zero: Projeto Prático',
    format: 'Guia + arquivos de apoio',
    audience: 'Iniciantes que querem construir e publicar seu primeiro site.',
    promise: 'Sair do zero até um projeto web simples, organizado e pronto para publicação.',
    priceModel: 'baixo ticket',
    status: 'planejado',
    cta: 'Entrar na lista de interesse',
    href: '/newsletter/'
  },
  {
    id: 'ia-na-pratica',
    name: 'IA na Prática',
    format: 'Guia + biblioteca de prompts',
    audience: 'Criadores, freelancers e pequenos negócios que querem usar IA com propósito.',
    promise: 'Aplicar IA em tarefas reais sem depender de prompts genéricos ou automações frágeis.',
    priceModel: 'baixo ticket',
    status: 'planejado',
    cta: 'Ver conteúdo gratuito',
    href: '/ia/'
  }
] as const;

export const offerLadder = [
  { level: 0, name: 'Gratuito', role: 'Atrair e gerar confiança', examples: 'Artigos, tutoriais, checklist e newsletter' },
  { level: 1, name: 'Entrada', role: 'Resolver um problema específico', examples: 'E-book, template, checklist ou biblioteca de prompts' },
  { level: 2, name: 'Principal', role: 'Entregar transformação mais completa', examples: 'Produto digital completo, pacote ou serviço' },
  { level: 3, name: 'Premium', role: 'Acelerar a implementação', examples: 'Consultoria, criação de site ou projeto personalizado' }
] as const;

export const monetizationChannels = [
  { id: 'digital-products', name: 'Produtos digitais', priority: 'alta', model: 'Margem alta e entrega escalável.', examples: 'E-books, templates, checklists, guias e bibliotecas.' },
  { id: 'services', name: 'Serviços', priority: 'alta', model: 'Monetiza habilidade e cria caixa mais rapidamente.', examples: 'Criação de sites, blogs, consultoria e freelancing.' },
  { id: 'affiliate', name: 'Afiliados', priority: 'média', model: 'Comissão por recomendação relevante.', examples: 'Ferramentas e serviços realmente usados ou analisados.' },
  { id: 'ads', name: 'Publicidade', priority: 'média', model: 'Receita baseada em audiência e inventário.', examples: 'Anúncios em conteúdos com tráfego recorrente.' }
] as const;

export const offerEvents = ['product_view', 'product_interest', 'offer_click', 'checkout_start', 'purchase', 'refund', 'upsell_view', 'upsell_click'] as const;

export const offerRules = [
  'Uma oferta deve resolver um problema claro, não apenas vender informação.',
  'A promessa precisa ser específica, realista e compatível com o que será entregue.',
  'O CTA deve aparecer depois de contexto e valor, sem interromper a experiência.',
  'Produtos pagos devem ter política de compra, privacidade e condições claras.',
  'Não criar escassez falsa, resultados garantidos ou provas sociais inventadas.',
  'Medir a jornada completa: conteúdo → lead → intenção → checkout → compra → retenção.'
] as const;
