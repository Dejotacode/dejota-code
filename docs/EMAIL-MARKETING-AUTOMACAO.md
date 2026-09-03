# Dejotacode — E-mail Marketing + Automação

## Objetivo
Construir uma audiência própria e conduzir cada assinante por uma jornada útil, segmentada e mensurável.

## Arquitetura
1. Captura com consentimento explícito.
2. Confirmação quando exigida pelo provedor/modelo adotado.
3. Identificação do segmento de interesse.
4. Sequência de boas-vindas ou nutrição.
5. Classificação por engajamento e intenção.
6. Oferta contextual quando houver intenção.
7. Pós-compra e retenção.
8. Reengajamento ou limpeza de contatos inativos.

## Sequências V1
- Boas-vindas: D+0, D+1, D+3, D+5, D+7.
- Renda Digital: D+0, D+2, D+4, D+7.
- Programação: D+0, D+2, D+5, D+8.
- IA: D+0, D+2, D+5, D+8.

## Princípios
- Entregar valor antes de vender.
- Uma ideia principal por e-mail.
- CTA coerente com a etapa da jornada.
- Não enviar conteúdo irrelevante apenas para manter frequência.
- Descadastro simples e imediato.
- Respeitar consentimento, finalidade e minimização de dados.
- Não comprar listas.
- Não usar automação para spam.

## Eventos
`email_subscribed`, `email_confirmed`, `email_sent`, `email_opened`, `email_clicked`, `email_unsubscribed`, `email_bounced`, `email_complaint`, `sequence_started`, `sequence_completed`.

## Métricas
Monitorar entrega, abertura, cliques, descadastros, reclamações, conversão por sequência e receita por assinante. Métricas de abertura devem ser interpretadas com cautela, pois dependem de mecanismos de privacidade dos provedores de e-mail.

## Configuração
A integração real permanece desligada até `PUBLIC_NEWSLETTER_ENDPOINT` ser configurado. O endpoint deve aceitar os campos de nome, e-mail, segmento, origem e consentimento, além de aplicar validação e proteção contra abuso.

## Checklist antes de produção
- [ ] Configurar provedor.
- [ ] Autenticar domínio de envio.
- [ ] Configurar remetente e endereço de resposta.
- [ ] Definir política de descadastro.
- [ ] Configurar páginas/links de privacidade.
- [ ] Testar inscrição, confirmação, envio, descadastro e bounce.
- [ ] Validar eventos.
- [ ] Testar mensagens em desktop e mobile.
- [ ] Fazer envio de teste antes de ativar automações.
