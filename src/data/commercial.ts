export const proposalConfig = {
  status: 'template',
  validityDays: 7,
  currency: 'BRL',
  note: 'Modelo comercial. Valores, prazos e condições devem ser definidos para cada projeto antes do envio.',
  sections: [
    'Resumo do problema e objetivo',
    'Escopo e entregáveis',
    'O que não está incluído',
    'Cronograma e marcos',
    'Investimento e forma de pagamento',
    'Premissas, responsabilidades e critérios de aceite',
    'Validade da proposta',
    'Próximos passos'
  ] as const
} as const;

export const proposalStages = [
  { stage: 'Diagnóstico', goal: 'Confirmar problema, objetivo e escopo possível.' },
  { stage: 'Proposta', goal: 'Transformar o diagnóstico em escopo, prazo e investimento claros.' },
  { stage: 'Negociação', goal: 'Ajustar condições sem criar escopo implícito.' },
  { stage: 'Aceite', goal: 'Registrar a decisão e preparar a contratação.' },
  { stage: 'Contrato', goal: 'Formalizar responsabilidades, pagamento, aceite e encerramento.' },
  { stage: 'Onboarding', goal: 'Coletar materiais, acessos seguros, contatos e próximos marcos.' }
] as const;

export const contractClauses = [
  'Partes e objeto do contrato.',
  'Escopo, entregáveis e critérios de aceite.',
  'Prazo, marcos e dependências do cliente.',
  'Valor, forma e condições de pagamento.',
  'Obrigações de cada parte e canais de comunicação.',
  'Alterações de escopo e serviços adicionais.',
  'Propriedade intelectual e uso de materiais.',
  'Confidencialidade e tratamento de dados quando aplicável.',
  'Rescisão, cancelamento e consequências financeiras.',
  'Limitações, responsabilidades e disposição sobre terceiros.',
  'Foro e demais condições jurídicas aplicáveis.'
] as const;

export const onboardingChecklist = [
  { phase: 'D+0', item: 'Confirmar pagamento/condição de início e enviar boas-vindas.' },
  { phase: 'D+1', item: 'Confirmar escopo, responsáveis, canal oficial e cronograma.' },
  { phase: 'D+1', item: 'Solicitar materiais e acessos estritamente necessários por meio seguro.' },
  { phase: 'D+3', item: 'Validar briefing final, referências e critérios de aceite.' },
  { phase: 'D+5', item: 'Registrar primeiro marco e próximos passos do projeto.' },
  { phase: 'Encerramento', item: 'Entregar documentação, orientações, feedback e próximos passos.' }
] as const;

export const commercialEvents = [
  'proposal_created',
  'proposal_sent',
  'proposal_viewed',
  'proposal_question',
  'proposal_accepted',
  'proposal_expired',
  'contract_sent',
  'contract_signed',
  'payment_confirmed',
  'onboarding_started',
  'onboarding_completed',
  'project_kickoff',
  'project_delivered'
] as const;

export const commercialRules = [
  'Nunca iniciar execução apenas com uma conversa informal; registrar escopo e aceite.',
  'Proposta não substitui contrato quando a contratação exigir instrumento formal.',
  'Não usar aprovação por clique como assinatura jurídica sem mecanismo adequado.',
  'Não pedir senhas por e-mail, formulário público ou documento comercial.',
  'Registrar alterações de escopo antes de executar trabalho adicional.',
  'Usar modelos contratuais revisados por profissional jurídico quando necessário.',
  'Minimizar dados pessoais e definir finalidade, acesso e retenção.'
] as const;
