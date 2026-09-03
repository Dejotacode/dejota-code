export type AuthorityChannel = {
  slug: string;
  name: string;
  goal: string;
  tactics: string[];
  metric: string;
};

export const authorityChannels: AuthorityChannel[] = [
  { slug: 'ativos-linkaveis', name: 'Ativos linkáveis', goal: 'Criar recursos que outras pessoas tenham motivo real para citar.', tactics: ['checklists', 'glossários', 'guias originais', 'templates', 'estudos próprios', 'calculadoras e ferramentas simples'], metric: 'links e menções conquistados por ativo' },
  { slug: 'digital-pr', name: 'Digital PR', goal: 'Transformar dados, experiências e análises em pautas úteis para sites e comunidades.', tactics: ['pautas baseadas em dados', 'comentários técnicos', 'cases', 'pesquisas próprias', 'tendências explicadas'], metric: 'menções qualificadas e referências editoriais' },
  { slug: 'parcerias', name: 'Parcerias', goal: 'Construir relações com criadores, comunidades e projetos complementares.', tactics: ['guest posts úteis', 'entrevistas', 'colaborações', 'webinars', 'troca de conhecimento'], metric: 'parcerias ativas e referências relevantes' },
  { slug: 'distribuicao', name: 'Distribuição', goal: 'Levar cada conteúdo para canais onde o público realmente está.', tactics: ['redes sociais', 'comunidades', 'newsletter', 'fóruns apropriados', 'agregadores permitidos'], metric: 'alcance qualificado e tráfego de referência' },
];

export const authorityRules = [
  'Priorizar relevância temática e utilidade, não quantidade de backlinks.',
  'Nunca comprar links, participar de esquemas artificiais ou automatizar spam.',
  'Pedir links somente quando o recurso realmente acrescentar valor ao conteúdo de destino.',
  'Personalizar cada contato e respeitar a decisão editorial de quem recebe a pauta.',
  'Registrar origem, página, data, tipo de menção e qualidade de cada oportunidade.',
  'Usar links conquistados como consequência de conteúdo excelente, relações e distribuição legítima.',
];

export const ninetyDayPlan = [
  { phase: 'Dias 1–30', focus: 'Fundação', actions: ['publicar 3 ativos linkáveis', 'criar página de recursos', 'montar lista inicial de 50 sites/projetos relevantes', 'definir 5 pautas de Digital PR', 'configurar planilha de oportunidades'] },
  { phase: 'Dias 31–60', focus: 'Relacionamento', actions: ['fazer contatos personalizados', 'propor 2–4 colaborações úteis', 'distribuir ativos nas comunidades adequadas', 'acompanhar menções e respostas', 'melhorar ativos com base no feedback'] },
  { phase: 'Dias 61–90', focus: 'Escala', actions: ['reaproveitar os melhores dados em novas pautas', 'publicar novos ativos com potencial de citação', 'fortalecer parceiros que geraram tráfego', 'atualizar páginas que já receberam referências', 'medir links, menções e tráfego de referência'] },
];

export const linkableAssets = [
  { title: 'Central de recursos para iniciantes', description: 'Checklists, guias e materiais práticos organizados por etapa da jornada.', href: '/recursos/' },
  { title: 'Conteúdo pilar e clusters', description: 'Guias aprofundados que podem servir como referência para conteúdos complementares.', href: '/blog/' },
  { title: 'Projetos e experimentos', description: 'Resultados e aprendizados documentados para transformar experiência em evidência.', href: '/projetos/' },
];
