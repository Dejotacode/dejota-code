# Dejotacode — Etapa 5.29

## Backend + Banco de Dados + Autenticação + API do Business OS

Esta etapa transforma a arquitetura preparada do Business OS em uma camada de servidor persistente, sem acoplar o front-end público a dados operacionais.

### Objetivos
- Persistir usuários, sessões, eventos, workflows e auditoria.
- Proteger rotas operacionais com sessão HTTP-only.
- Aplicar RBAC por função.
- Expor API REST para o Business OS.
- Preparar execução no Cloudflare Workers + D1.
- Manter segredos exclusivamente no ambiente do servidor.

### Stack desta entrega
- TypeScript
- Hono
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Web Crypto / PBKDF2 para senha
- Sessão opaca armazenada como hash no banco

### Fluxo
Browser → API → autenticação/RBAC → serviço de domínio → D1 → auditoria

Evento → persistência → seleção de workflow → fila `queued` → execução futura → métricas/auditoria

### Endpoints
- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/os/events`
- `GET /api/os/events`
- `GET /api/os/workflows`
- `GET /api/os/audit`

### Eventos conectados nesta etapa
- `lead_created`
- `crm_deal_won`
- `delivery_accepted`
- `feedback_submitted`
- `finance_payment_received`
- `kpi_deviation`

Os demais eventos da Etapa 5.28 continuam válidos como contrato de domínio e podem ser adicionados ao dispatcher sem alterar o modelo de persistência.

### Perfis
- `owner`: controle total.
- `admin`: administração operacional.
- `editor`: conteúdo.
- `sales`: comercial/CRM.
- `ops`: operações/projetos.
- `finance`: financeiro.

### Segurança
- Cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Token de sessão nunca é salvo em texto puro no banco.
- Senhas com PBKDF2-SHA-256 e salt aleatório.
- RBAC antes das operações sensíveis.
- Auditoria de login, erros e enfileiramento de workflows.
- Nenhuma credencial real incluída.
- Dados financeiros e operacionais não são expostos ao site público por padrão.

### LGPD / governança
A aplicação deve coletar somente dados necessários, definir retenção, informar finalidade e proteger dados pessoais. O banco operacional deve permanecer separado da camada pública e o acesso deve seguir o princípio do menor privilégio.

### O que ainda não é feito automaticamente
- Envio real de e-mail.
- Pagamentos.
- CRM externo.
- Execução de workflows em background.
- Rotação automática de chaves.
- MFA.
- Recuperação de senha.
- Migração de dados reais.

Esses itens são deliberadamente deixados para etapas de integração e hardening, evitando fingir que um serviço externo já está conectado.
