# API Contract — 5.29

## POST `/api/auth/login`
```json
{"email":"admin@example.com","password":"..."}
```
Resposta de sucesso: `{ "user": { "id": "...", "email": "...", "name": "...", "role": "owner" } }`

## POST `/api/os/events`
Requer sessão autenticada.
```json
{
  "eventName":"lead_created",
  "aggregateType":"lead",
  "aggregateId":"lead-123",
  "payload":{"source":"organic","qualified":false}
}
```
Resposta: `{ "eventId":"...", "workflowIds":["lead-created"] }`

## GET `/api/os/events`
Lista eventos recentes para perfis operacionais autorizados.

## GET `/api/os/workflows`
Lista execuções/fila de workflows.

## GET `/api/os/audit`
Lista auditoria administrativa.

## Erros
- `400`: payload inválido.
- `401`: sessão ausente/inválida.
- `403`: função sem permissão.
- `500`: erro interno, sem expor detalhes ao cliente.
