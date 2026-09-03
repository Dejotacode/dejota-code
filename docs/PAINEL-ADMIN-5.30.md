# Etapa 5.30 — Painel Administrativo + Login + Gestão de Usuários + Controle de Acesso

## Objetivo
Criar a primeira interface operacional protegida do Business OS sobre a API da Etapa 5.29.

## Entregas
- `/admin` e `/admin/` com painel responsivo.
- Login usando a sessão HTTP-only da API.
- Logout.
- Visão geral com contadores derivados da API.
- Gestão de usuários para `owner` e `admin`.
- Criação de usuários com senha inicial e perfil.
- Ativação/desativação de usuários.
- Proteção contra auto-desativação.
- Regra de que somente `owner` pode criar/alterar outro `owner`.
- Visualização de eventos, workflows e auditoria conforme RBAC.
- Interface alinhada à identidade visual Dejota Code.

## Perfis
`owner`, `admin`, `editor`, `sales`, `ops`, `finance`.

## Princípio de segurança
O front-end apenas melhora a experiência. A autorização real continua no servidor, em cada endpoint.

## Rotas novas
- `GET /admin`
- `GET /admin/`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id`

## Não incluído
- Reset de senha por e-mail.
- MFA/2FA.
- Gestão de permissões customizadas por usuário.
- Upload de avatar.
- CRUD completo de CRM/financeiro/projetos.

Esses itens podem entrar em etapas posteriores.
