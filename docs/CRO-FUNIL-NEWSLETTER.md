# Etapa 5.15 — CRO + Funil de Conversão + Newsletter Avançada

## Objetivo
Transformar tráfego orgânico e recorrente em relacionamento próprio, sem depender de CTAs genéricos ou de uma única oferta.

## Arquitetura
1. Descoberta: conteúdo responde a uma intenção.
2. Conteúdo: prova, clareza, experiência e próximo passo.
3. Captura: lead magnet ou newsletter contextual.
4. Relacionamento: conteúdo segmentado e útil.
5. Oferta: produto, serviço, afiliado ou projeto quando houver intenção.
6. Retenção: atualização, novos conteúdos e retorno ao site.

## CRO por contexto
- Programação → tutorial e projeto.
- Linux & Segurança → prática e segurança.
- Criptoativos → educação e gestão de risco, sem promessa financeira.
- Renda Digital → Comece Aqui + material gratuito.
- IA → aplicação prática.
- Tech & Tendências → análise e conteúdo relacionado.
- Tutoriais → próximo passo resolutivo.

## Newsletter avançada
Os formulários continuam provider-neutral. O campo `segment` permite que um provedor futuro receba o contexto da inscrição.

Variável de produção:
`PUBLIC_NEWSLETTER_ENDPOINT`

O frontend não promete captura real enquanto o endpoint não estiver configurado.

## Eventos
`cta_click`, `lead_magnet_view`, `lead_magnet_click`, `lead_magnet_download`, `newsletter_start`, `newsletter_submit`, `newsletter_error`, `next_step_click`, `affiliate_click`, `contact_click`, `product_view`, `product_click`.

## Métricas
- CTR de CTA por página;
- taxa de início do formulário;
- taxa de conclusão;
- conversão por segmento;
- downloads por lead magnet;
- origem da inscrição;
- cliques em ofertas;
- retorno de visitantes.

## Testes
Testar uma hipótese por vez. Priorizar mudanças de mensagem, CTA, posicionamento, prova e fricção do formulário. Não declarar vencedor sem volume suficiente para a decisão.

## Privacidade
Captura deve exigir consentimento, finalidade clara e possibilidade de cancelamento. Não coletar campos desnecessários.
