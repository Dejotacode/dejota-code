export type ContentCluster = {
  slug: string;
  pillar: string;
  description: string;
  intent: 'informacional' | 'comercial' | 'navegacional' | 'transacional';
  priority: 'alta' | 'media' | 'baixa';
  keywords: string[];
  topics: string[];
};

export const contentClusters: ContentCluster[] = [
  { slug: 'fundamentos-web', pillar: 'Programação', description: 'Base para iniciantes criarem, publicarem e evoluírem projetos web.', intent: 'informacional', priority: 'alta', keywords: ['como criar um site', 'desenvolvimento web para iniciantes', 'HTML CSS JavaScript'], topics: ['HTML para iniciantes', 'CSS na prática', 'JavaScript para iniciantes', 'Como criar um site do zero', 'Como publicar um site grátis'] },
  { slug: 'linux-pratico', pillar: 'Linux & Segurança', description: 'Terminal, administração e fundamentos de segurança para quem está começando.', intent: 'informacional', priority: 'alta', keywords: ['comandos Linux', 'Linux para iniciantes', 'terminal Linux'], topics: ['Comandos Linux essenciais', 'Permissões de arquivos no Linux', 'Como instalar programas no Linux', 'SSH para iniciantes', 'Backup e segurança no Linux'] },
  { slug: 'criptoativos-basico', pillar: 'Criptoativos', description: 'Educação básica para compreender blockchain e criptoativos com responsabilidade.', intent: 'informacional', priority: 'media', keywords: ['o que é blockchain', 'criptoativos para iniciantes', 'como funciona bitcoin'], topics: ['O que é blockchain', 'Como funciona Bitcoin', 'Carteiras de criptoativos', 'Segurança em carteiras', 'Glossário de criptoativos'] },
  { slug: 'primeira-renda-digital', pillar: 'Renda Digital', description: 'Caminhos práticos para transformar habilidades digitais em oportunidades de renda.', intent: 'comercial', priority: 'alta', keywords: ['renda extra online', 'como ser freelancer', 'trabalho online para iniciantes'], topics: ['Como começar como freelancer', 'Como montar um portfólio', 'Como conseguir o primeiro cliente', 'Precificação para freelancers', 'Afiliados para iniciantes'] },
  { slug: 'ia-na-pratica', pillar: 'Inteligência Artificial', description: 'Aplicações práticas de IA para estudo, produtividade, criação e negócios.', intent: 'informacional', priority: 'alta', keywords: ['IA para iniciantes', 'ferramentas de IA', 'como usar inteligência artificial'], topics: ['IA para iniciantes', 'Ferramentas de IA gratuitas', 'Prompts para produtividade', 'IA para criação de conteúdo', 'Automação com IA'] },
  { slug: 'tecnologia-e-tendencias', pillar: 'Tech & Tendências', description: 'Guias e análises para entender mudanças relevantes no mercado de tecnologia.', intent: 'informacional', priority: 'media', keywords: ['tendências de tecnologia', 'novas tecnologias', 'mercado de tecnologia'], topics: ['Como acompanhar tendências tech', 'Glossário de tecnologia', 'Como avaliar uma nova ferramenta', 'Tecnologias que estão mudando o trabalho', 'Guia de ferramentas digitais'] },
  { slug: 'tutoriais-resolutivos', pillar: 'Tutoriais & Guias', description: 'Conteúdo orientado a tarefas, problemas concretos e resultados rápidos.', intent: 'informacional', priority: 'alta', keywords: ['tutorial passo a passo', 'como fazer', 'guia prático'], topics: ['Como publicar um site', 'Como configurar domínio', 'Como criar um projeto simples', 'Como resolver erros comuns', 'Checklist de publicação'] },
];

export const editorialPrinciples = [
  'Uma página principal por intenção de busca e tema central.',
  'Cada artigo de apoio aponta para um conteúdo pilar e para o próximo passo lógico.',
  'Evitar canibalização: não criar vários artigos com a mesma intenção principal.',
  'Atualizar conteúdos que já recebem impressões antes de produzir novos conteúdos semelhantes.',
  'Priorizar profundidade, experiência prática, exemplos e clareza para iniciantes.',
  'Conectar SEO, newsletter e conversão sem sacrificar a utilidade do conteúdo.',
];

export function getCluster(slug?: string) {
  return contentClusters.find((cluster) => cluster.slug === slug);
}
