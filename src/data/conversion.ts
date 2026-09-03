export const conversionFunnels = [
  { id: 'discover', step: 1, name: 'Descoberta', goal: 'Atrair a pessoa certa com conteúdo útil.', next: 'Consumir conteúdo' },
  { id: 'content', step: 2, name: 'Conteúdo', goal: 'Entregar uma resposta clara e gerar confiança.', next: 'Avançar para um próximo passo' },
  { id: 'lead', step: 3, name: 'Captura', goal: 'Trocar valor por um cadastro consciente.', next: 'Receber material ou newsletter' },
  { id: 'relationship', step: 4, name: 'Relacionamento', goal: 'Manter contato com conteúdo relevante.', next: 'Engajar e conhecer ofertas' },
  { id: 'offer', step: 5, name: 'Oferta', goal: 'Apresentar a próxima solução quando houver intenção.', next: 'Comprar ou contratar' },
  { id: 'retention', step: 6, name: 'Retenção', goal: 'Transformar cliente em relacionamento de longo prazo.', next: 'Voltar, recomendar e evoluir' }
] as const;

export const ctaByCategory = {
  Programação: { label: 'Continue construindo', href: '/tutoriais-guias/', description: 'Veja o próximo tutorial prático.' },
  'Linux & Segurança': { label: 'Pratique agora', href: '/linux-seguranca/', description: 'Avance para mais guias de Linux e segurança.' },
  Criptoativos: { label: 'Continue aprendendo', href: '/criptoativos/', description: 'Explore os fundamentos antes de tomar decisões.' },
  'Renda Digital': { label: 'Escolha seu próximo passo', href: '/comece-aqui/', description: 'Organize sua jornada de renda digital.' },
  IA: { label: 'Aplicar IA na prática', href: '/ia/', description: 'Veja guias simples para transformar IA em prática.' },
  'Tech & Tendências': { label: 'Explorar tecnologia', href: '/tech-tendencias/', description: 'Acompanhe tendências com contexto.' },
  'Tutoriais & Guias Práticos': { label: 'Ver mais tutoriais', href: '/tutoriais-guias/', description: 'Resolva o próximo problema passo a passo.' }
} as const;

export const leadMagnets = [
  { id: 'primeiros-passos-renda-digital', name: 'Primeiros Passos para sua Renda Digital', segment: 'Renda Digital', href: '/lead-magnet/primeiros-passos-renda-digital.pdf', promise: 'Um plano simples de 7 dias para sair da ideia e começar.' },
  { id: 'checklist-publicar-site', name: 'Checklist para publicar seu primeiro site', segment: 'Programação', href: '/tutoriais-guias/', promise: 'Uma sequência prática para preparar, revisar e publicar um projeto web.' },
  { id: 'guia-ia-pratica', name: 'Guia de IA na prática', segment: 'IA', href: '/ia/', promise: 'Um mapa de primeiros usos de IA para aprender e produzir melhor.' }
] as const;

export const funnelEvents = [
  'cta_click', 'lead_magnet_view', 'lead_magnet_click', 'lead_magnet_download',
  'newsletter_start', 'newsletter_submit', 'newsletter_error', 'next_step_click',
  'affiliate_click', 'contact_click', 'product_view', 'product_click'
] as const;

export const croChecklist = [
  'Uma promessa clara acima da dobra',
  'Um CTA primário por contexto',
  'Próximo passo lógico depois do conteúdo',
  'Formulário curto e consentimento explícito',
  'Prova/experiência sem afirmações exageradas',
  'Mensuração dos cliques e cadastros',
  'Teste de uma hipótese por vez',
  'Atualização baseada em comportamento real'
] as const;
