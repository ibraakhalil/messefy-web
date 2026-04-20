import type { Context } from 'hono';
import { isValidUUID } from '../utils/validators';
import { buildCurrentWorkspaceSummary, buildPeriodSummary } from '../utils/summary';

export async function getPeriodSummary(c: Context) {
  const periodId = c.req.param('periodId');
  const userId = c.get('userId');

  if (!periodId || !isValidUUID(periodId)) {
    return c.json({ error: 'Invalid period ID' }, 400);
  }

  try {
    const summary = await buildPeriodSummary(periodId, userId);
    return c.json(summary);
  } catch (error) {
    console.error('Error fetching period summary:', error);
    throw error;
  }
}

export async function getCurrentWorkspaceSummary(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const userId = c.get('userId');

  if (!workspaceId || !isValidUUID(workspaceId)) {
    return c.json({ error: 'Invalid workspace ID' }, 400);
  }

  try {
    const summary = await buildCurrentWorkspaceSummary(workspaceId, userId);
    return c.json(summary);
  } catch (error) {
    console.error('Error fetching current workspace summary:', error);
    throw error;
  }
}
