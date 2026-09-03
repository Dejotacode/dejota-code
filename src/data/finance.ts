export const financeConfig = {
  name: 'Dejotacode Financeiro', provider: 'provider-neutral', enabled: false,
  currency: 'BRL', note: 'Camada financeira preparada para integração segura com vendas, pagamentos e contabilidade. Nenhum dado financeiro real é inventado nesta etapa.'
} as const;

export const revenueStreams = [
  { id: 'services', name: 'Serviços', examples: 'Sites, landing pages, consultoria, automação e manutenção' },
  { id: 'products', name: 'Produtos digitais', examples: 'E-books, guias, templates e bibliotecas de prompts' },
  { id: 'affiliates', name: 'Afiliados', examples: 'Comissões de ferramentas e serviços recomendados' },
  { id: 'ads', name: 'Publicidade', examples: 'Receita de anúncios e mídia' }
] as const;

export const costCategories = [
  { id: 'fixed', name: 'Custos fixos', examples: 'Hospedagem, domínios, softwares e serviços recorrentes' },
  { id: 'variable', name: 'Custos variáveis', examples: 'Taxas de pagamento, mídia, comissões e custos por venda' },
  { id: 'project', name: 'Custos de projeto', examples: 'Ferramentas, terceiros e recursos diretamente ligados à entrega' },
  { id: 'acquisition', name: 'Aquisição', examples: 'Publicidade, ferramentas de marketing e produção comercial' },
  { id: 'tax', name: 'Tributos e obrigações', examples: 'Impostos e custos legais/contábeis aplicáveis' }
] as const;

export const financialKPIs = [
  { name: 'Receita bruta', formula: 'Soma das vendas e demais receitas antes das deduções' },
  { name: 'Receita líquida', formula: 'Receita bruta − taxas, descontos, devoluções e outras deduções' },
  { name: 'Custos totais', formula: 'Custos fixos + variáveis + projeto + aquisição + obrigações' },
  { name: 'Margem de contribuição', formula: '(Receita líquida − custos variáveis) / Receita líquida × 100' },
  { name: 'Margem operacional', formula: '(Receita líquida − custos totais) / Receita líquida × 100' },
  { name: 'Ticket médio', formula: 'Receita de vendas / número de vendas' },
  { name: 'Ponto de equilíbrio', formula: 'Custos fixos / margem de contribuição percentual' },
  { name: 'Fluxo de caixa líquido', formula: 'Entradas recebidas − saídas pagas no período' },
  { name: 'Contas a receber', formula: 'Valores faturados/contratados ainda não recebidos' },
  { name: 'Runway', formula: 'Caixa disponível / queima média mensal, quando aplicável' }
] as const;

export const cashFlowCategories = [
  { name: 'Entradas', items: ['Serviços recebidos', 'Produtos recebidos', 'Comissões', 'Publicidade', 'Outras receitas'] },
  { name: 'Saídas operacionais', items: ['Ferramentas', 'Infraestrutura', 'Marketing', 'Terceiros', 'Operação'] },
  { name: 'Saídas administrativas', items: ['Contabilidade', 'Tributos', 'Taxas bancárias', 'Obrigações'] }
] as const;

export const financialCadence = [
  { cadence: 'Diária', focus: 'Registrar entradas e saídas relevantes e verificar vencimentos críticos.' },
  { cadence: 'Semanal', focus: 'Conciliar recebimentos, contas a pagar, contas a receber e caixa projetado.' },
  { cadence: 'Mensal', focus: 'Fechar competência, analisar receita, custos, margem e resultado.' },
  { cadence: 'Trimestral', focus: 'Revisar preços, rentabilidade por oferta, estrutura de custos e metas.' }
] as const;

export const profitabilityRules = [
  'Não confundir venda contratada com dinheiro recebido.',
  'Separar receita bruta, receita líquida, custos e lucro.',
  'Calcular rentabilidade por serviço/produto quando houver dados suficientes.',
  'Incluir taxas e custos diretamente relacionados à venda ou entrega.',
  'Nunca inventar valores para preencher dashboards.',
  'Registrar competência e data de caixa separadamente quando necessário.',
  'Decisões de preço devem considerar custos, margem desejada e capacidade de entrega.'
] as const;

export const financeEvents = [
  'finance_revenue_recorded', 'finance_payment_received', 'finance_expense_recorded',
  'finance_invoice_created', 'finance_invoice_paid', 'finance_refund_recorded',
  'finance_reconciliation_completed', 'finance_month_closed', 'finance_margin_reviewed',
  'finance_cash_forecast_updated', 'finance_kpi_deviation'
] as const;
