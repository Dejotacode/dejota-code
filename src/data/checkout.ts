export const checkoutConfig = {
  provider: 'não configurado',
  mode: 'provider-neutral',
  currency: 'BRL',
  enabled: false,
  note: 'O checkout real só deve ser ativado após a escolha e configuração segura de um provedor de pagamentos.'
} as const;

export const paymentMethods = [
  { id: 'pix', name: 'PIX', status: 'planejado', note: 'Ativação depende do provedor de pagamento.' },
  { id: 'card', name: 'Cartão', status: 'planejado', note: 'Ativação depende do provedor de pagamento.' },
  { id: 'boleto', name: 'Boleto', status: 'opcional', note: 'Avaliar conforme público, produto e provedor.' }
] as const;

export const purchaseFlow = [
  { step: 1, name: 'Oferta', description: 'Produto, promessa, preço, condições e CTA claros.' },
  { step: 2, name: 'Checkout', description: 'Cliente confirma produto e inicia o pagamento em ambiente seguro.' },
  { step: 3, name: 'Pagamento', description: 'O provedor processa a transação e retorna o resultado.' },
  { step: 4, name: 'Confirmação', description: 'Pedido aprovado gera confirmação e instruções de acesso.' },
  { step: 5, name: 'Entrega', description: 'Arquivo, acesso ou instrução é disponibilizado conforme o produto.' },
  { step: 6, name: 'Pós-venda', description: 'Onboarding, suporte, feedback e relacionamento.' }
] as const;

export const deliveryModels = [
  { id: 'download', name: 'Download protegido', description: 'Entrega de PDF, ZIP ou material digital após confirmação.' },
  { id: 'access', name: 'Acesso por área', description: 'Produto futuro entregue por uma área autenticada.' },
  { id: 'service', name: 'Entrega de serviço', description: 'Onboarding e próximos passos após contratação.' }
] as const;

export const postPurchaseSequence = [
  { day: 0, name: 'Confirmação', goal: 'Confirmar a compra e orientar o acesso.' },
  { day: 1, name: 'Onboarding', goal: 'Mostrar como começar e qual resultado buscar primeiro.' },
  { day: 3, name: 'Ativação', goal: 'Estimular a primeira ação prática.' },
  { day: 7, name: 'Suporte', goal: 'Recolher dúvidas e reduzir abandono.' },
  { day: 14, name: 'Feedback', goal: 'Coletar percepção, dificuldades e sugestões.' },
  { day: 30, name: 'Retenção', goal: 'Apresentar próximo passo relevante, quando fizer sentido.' }
] as const;

export const checkoutEvents = [
  'checkout_view', 'checkout_start', 'payment_method_selected', 'payment_success',
  'payment_failed', 'purchase', 'delivery_view', 'delivery_download', 'support_click',
  'refund_request', 'post_purchase_engaged', 'upsell_view', 'upsell_click'
] as const;

export const checkoutSecurityRules = [
  'Nunca armazenar dados completos de cartão no site estático.',
  'Usar checkout hospedado ou integração oficial do provedor escolhido.',
  'Validar a confirmação da compra no servidor/webhook antes de liberar uma entrega protegida.',
  'Não liberar arquivo premium apenas porque o navegador retornou uma URL de sucesso.',
  'Manter segredos e chaves privadas somente no ambiente seguro do provedor/backend.',
  'Registrar o mínimo necessário de dados e respeitar privacidade, consentimento e retenção.',
  'Testar pagamentos aprovados, recusados, cancelados, estornados e duplicados.'
] as const;

export const checkoutEnvironment = {
  publicVariables: ['PUBLIC_CHECKOUT_URL'],
  serverVariables: ['CHECKOUT_SECRET_KEY', 'CHECKOUT_WEBHOOK_SECRET'],
  requiredBeforeProduction: [
    'Escolher provedor', 'Configurar domínio/remetente', 'Configurar produtos e preços',
    'Configurar políticas', 'Configurar webhook', 'Testar sandbox', 'Testar entrega', 'Validar conciliação'
  ]
} as const;
