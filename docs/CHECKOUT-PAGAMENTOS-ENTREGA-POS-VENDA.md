# Etapa 5.18 — Checkout + Pagamentos + Entrega Digital + Pós-venda

## Objetivo
Preparar a Dejotacode para uma operação comercial segura sem conectar um provedor de pagamentos antes da hora.

## Fluxo
Oferta → Checkout → Pagamento → Confirmação → Entrega → Onboarding → Suporte → Feedback → Retenção.

## Princípio técnico
A V1 continua estática/provider-neutral. O navegador nunca deve ser responsável por validar sozinho uma compra nem por guardar segredos de pagamento.

## Configuração futura
Variável pública prevista: `PUBLIC_CHECKOUT_URL`.
Segredos previstos somente no servidor/provedor: `CHECKOUT_SECRET_KEY` e `CHECKOUT_WEBHOOK_SECRET`.

## Entrega
Para arquivos pagos, a liberação deve acontecer depois da confirmação confiável do pagamento. Uma futura área autenticada poderá substituir links simples por controle de acesso.

## Pós-venda
D+0 confirmação; D+1 onboarding; D+3 ativação; D+7 suporte; D+14 feedback; D+30 retenção/próximo passo.

## Eventos
`checkout_view`, `checkout_start`, `payment_method_selected`, `payment_success`, `payment_failed`, `purchase`, `delivery_view`, `delivery_download`, `support_click`, `refund_request`, `post_purchase_engaged`, `upsell_view`, `upsell_click`.

## Checklist de produção
- Escolher provedor.
- Configurar produtos e preços.
- Configurar checkout seguro.
- Configurar webhooks.
- Testar sandbox.
- Testar aprovação, recusa, cancelamento, estorno e duplicidade.
- Validar entrega após confirmação.
- Definir suporte e política de reembolso.
- Revisar privacidade/LGPD e retenção.
- Fazer conciliação e monitoramento.
