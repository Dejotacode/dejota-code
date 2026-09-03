# Etapa 5.37.1 — Fase 11: Segurança, Auth, RBAC, API e CMS

## Objetivo
Endurecer a base antes da exposição pública do backend e do painel administrativo.

## Mudanças aplicadas
- headers defensivos e `X-Request-ID` nas respostas da API;
- `Cache-Control: no-store` em rotas `/admin/*` e `/auth/*`;
- rate limit de login: 5 tentativas em 10 minutos, seguido de bloqueio temporário de 15 minutos;
- auditoria de falhas de login sem armazenar e-mail em texto puro no log;
- política mínima de senha de 12 a 128 caracteres para novos usuários;
- bootstrap seguro do primeiro owner usando `BOOTSTRAP_TOKEN` e somente enquanto não existir owner ativo;
- desativação da antiga conta seed `user-admin-seed` pela migration `0012_security_hardening.sql`;
- revogação automática de sessão expirada quando consultada;
- verificação de origem nas mutações administrativas, logout e eventos do Business OS;
- limites iniciais de payload e metadata nos endpoints públicos de analytics/conversão;
- validação do nome de eventos do Business OS;
- versão da API separada da etapa interna do projeto.

## Bootstrap inicial
1. Gere um token longo e aleatório.
2. Configure `BOOTSTRAP_TOKEN` como secret do Worker.
3. Faça uma única chamada `POST /api/auth/bootstrap` com header `X-Bootstrap-Token` e nome/e-mail/senha do primeiro owner.
4. Depois da criação, remova ou rotacione o secret. O endpoint recusa novas criações quando já existe owner ativo.

## Pendências antes da produção
- configurar Turnstile ou mecanismo equivalente para formulários sujeitos a abuso;
- avaliar Rate Limiting nativo da Cloudflare para endpoints públicos de alto volume;
- revisar CORS quando o domínio final de Pages/API estiver definido;
- revisar sanitização HTML com uma suíte dedicada de casos maliciosos;
- adicionar gestão de sessões no Admin (listar/revogar todas as sessões do usuário);
- evoluir RBAC de papéis para permissões granulares conforme o Business OS crescer;
- validar conteúdo real de uploads além do MIME declarado pelo navegador.

## Importante
`noindex` não é autenticação. Qualquer interface privada do Business OS deve depender de sessão válida e autorização no backend.

## RBAC editorial aplicado
- `editor`: cria/edita conteúdo em `draft` ou `review`, gerencia tags, comentários e mídia conforme rotas permitidas;
- `owner/admin`: podem publicar/despublicar artigos e executar exclusões destrutivas de posts/categorias;
- desativar usuário revoga todas as sessões ativas daquele usuário.
