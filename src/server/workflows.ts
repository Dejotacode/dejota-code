import type { Env, WorkflowStatus } from './types';
import { randomId } from './security';
import { writeAudit } from './db';

export const WORKFLOW_IDS = [
  'lead-created',
  'deal-won',
  'delivery-accepted',
  'feedback-submitted',
  'finance-payment-received',
  'kpi-deviation'
] as const;

export async function registerEvent(env: Env, input: {
  eventName: string;
  aggregateType?: string;
  aggregateId?: string;
  payload: unknown;
  actorUserId?: string;
}) {
  const eventId = randomId();
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO os_events (id,event_name,aggregate_type,aggregate_id,payload_json,source,actor_user_id,created_at) VALUES (?,?,?,?,?,?,?,?)`)
    .bind(eventId, input.eventName, input.aggregateType ?? null, input.aggregateId ?? null, JSON.stringify(input.payload), 'api', input.actorUserId ?? null, now).run();
  return eventId;
}

export async function queueWorkflow(env: Env, workflowId: string, eventId: string): Promise<void> {
  await env.DB.prepare(`INSERT OR IGNORE INTO workflow_runs (id,workflow_id,event_id,status,attempts,created_at) VALUES (?,?,?,?,?,?)`)
    .bind(randomId(), workflowId, eventId, 'queued' satisfies WorkflowStatus, 0, new Date().toISOString()).run();
}

export async function dispatchEvent(env: Env, eventName: string, eventId: string): Promise<string[]> {
  const map: Record<string, string> = {
    lead_created: 'lead-created',
    crm_deal_won: 'deal-won',
    delivery_accepted: 'delivery-accepted',
    feedback_submitted: 'feedback-submitted',
    finance_payment_received: 'finance-payment-received',
    kpi_deviation: 'kpi-deviation'
  };
  const workflowId = map[eventName];
  if (!workflowId) return [];
  await queueWorkflow(env, workflowId, eventId);
  return [workflowId];
}

export async function auditWorkflowQueue(env: Env, actorUserId: string | undefined, eventId: string, workflowIds: string[]) {
  await writeAudit(env, {
    actorUserId,
    action: 'os.workflow.queued',
    resourceType: 'os_event',
    resourceId: eventId,
    metadata: { workflowIds }
  });
}
