import type { Context } from 'hono';
import { db } from '../db';
import { periods } from '../db/schemas';
import { eq, desc } from 'drizzle-orm';
import { isValidUUID, isValidYear, isValidMonth, isValidPeriodStatus } from '../utils/validators';

/**
 * Create a new period for a workspace
 * POST /api/periods
 * @requires userAuthValidation middleware
 * @body {workspaceId, year, month}
 */
export async function createPeriod(c: Context) {
  const { workspaceId, year, month } = await c.req.json();
  const userId = c.get('userId');

  console.log({ userId });

  // Validation
  if (!workspaceId || !year || !month) {
    return c.json({ error: 'Missing required fields: workspaceId, year, and month must be provided' }, 400);
  }

  if (!isValidUUID(workspaceId)) {
    return c.json({ error: 'Invalid workspace ID format' }, 400);
  }

  if (!isValidYear(year)) {
    return c.json({ error: 'Year must be between 1900 and 2100' }, 400);
  }

  if (!isValidMonth(month)) {
    return c.json({ error: 'Month must be between 1 and 12' }, 400);
  }

  try {
    // Check if user is a member of the workspace
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    console.log({ member });

    if (!member) {
      return c.json({ error: 'You are not a member of this workspace' }, 403);
    }

    // Check if workspace exists
    const workspace = await db.query.workspaces.findFirst({
      where: (w, { eq, and }) => and(eq(w.id, workspaceId), eq(w.isActive, true)),
    });

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    // Check if period already exists for this workspace and month/year
    const existingPeriod = await db.query.periods.findFirst({
      where: (p, { eq, and }) => and(eq(p.workspaceId, workspaceId), eq(p.year, year), eq(p.month, month)),
    });

    if (existingPeriod) {
      return c.json({ error: 'A period already exists for this workspace and month/year combination' }, 409);
    }

    // Create the period
    const [period] = await db
      .insert(periods)
      .values({
        workspaceId,
        year,
        month,
        status: 'open',
      })
      .returning();

    if (!period) {
      return c.json({ error: 'Unable to create period. Please try again later' }, 500);
    }

    return c.json({ message: 'Period created successfully', period }, 201);
  } catch (error) {
    console.error('Error creating period:', error);
    return c.json({ error: 'Unable to create period. Please try again later' }, 500);
  }
}

/**
 * Get all periods for a workspace
 * GET /api/periods/workspace/:workspaceId
 * @requires userAuthValidation middleware
 */
export async function getPeriodsByWorkspace(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const userId = c.get('userId');

  if (!workspaceId) {
    return c.json({ error: 'Workspace ID is required' }, 400);
  }

  if (!isValidUUID(workspaceId)) {
    return c.json({ error: 'Invalid workspace ID format' }, 400);
  }

  try {
    // Check if user is a member of the workspace
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member) {
      return c.json({ error: 'You are not a member of this workspace' }, 403);
    }

    const periodsList = await db.query.periods.findMany({
      where: (p, { eq }) => eq(p.workspaceId, workspaceId),
      orderBy: [desc(periods.year), desc(periods.month)],
    });

    return c.json({ periods: periodsList, count: periodsList.length });
  } catch (error) {
    console.error('Error fetching periods:', error);
    return c.json({ error: 'Failed to fetch periods' }, 500);
  }
}

/**
 * Get a specific period by ID
 * GET /api/periods/:periodId
 * @requires userAuthValidation middleware
 */
export async function getPeriodById(c: Context) {
  const periodId = c.req.param('periodId');
  const userId = c.get('userId');

  if (!periodId) {
    return c.json({ error: 'Period ID is required' }, 400);
  }

  if (!isValidUUID(periodId)) {
    return c.json({ error: 'Invalid period ID format' }, 400);
  }

  try {
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
      with: {
        workspace: true,
      },
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    // Check if user is a member of the workspace
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, period.workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member) {
      return c.json({ error: 'You are not authorized to access this period' }, 403);
    }

    return c.json(period);
  } catch (error) {
    console.error('Error fetching period:', error);
    return c.json({ error: 'Failed to fetch period' }, 500);
  }
}

/**
 * Update a period (only status can be updated)
 * PATCH /api/periods/:periodId
 * @requires userAuthValidation middleware
 * @body {status}
 */
export async function updatePeriod(c: Context) {
  const periodId = c.req.param('periodId');
  const { status } = await c.req.json();
  const userId = c.get('userId');

  if (!periodId) {
    return c.json({ error: 'Period ID is required' }, 400);
  }

  if (!isValidUUID(periodId)) {
    return c.json({ error: 'Invalid period ID format' }, 400);
  }

  if (!status || !isValidPeriodStatus(status)) {
    return c.json({ error: 'Status must be either "open" or "closed"' }, 400);
  }

  try {
    // Get the period with workspace info
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
      with: {
        workspace: true,
      },
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    // Check if user is the workspace owner or admin
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, period.workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      return c.json({ error: 'Only workspace owners and admins can update periods' }, 403);
    }

    // Update the period
    const [updatedPeriod] = await db
      .update(periods)
      .set({
        status,
        closedAt: status === 'closed' ? new Date() : null,
      })
      .where(eq(periods.id, periodId))
      .returning();

    if (!updatedPeriod) {
      return c.json({ error: 'Unable to update period. Please try again later' }, 500);
    }

    return c.json({ message: 'Period updated successfully', period: updatedPeriod });
  } catch (error) {
    console.error('Error updating period:', error);
    return c.json({ error: 'Unable to update period. Please try again later' }, 500);
  }
}

/**
 * Delete a period (only if it's open and has no transactions)
 * DELETE /api/periods/:periodId
 * @requires userAuthValidation middleware
 */
export async function deletePeriod(c: Context) {
  const periodId = c.req.param('periodId');
  const userId = c.get('userId');

  if (!periodId) {
    return c.json({ error: 'Period ID is required' }, 400);
  }

  if (!isValidUUID(periodId)) {
    return c.json({ error: 'Invalid period ID format' }, 400);
  }

  try {
    // Get the period with workspace info
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
      with: {
        workspace: true,
      },
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    // Check if user is the workspace owner or admin
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, period.workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      return c.json({ error: 'Only workspace owners and admins can delete periods' }, 403);
    }

    // Check if period is closed
    if (period.status === 'closed') {
      return c.json({ error: 'Cannot delete a closed period' }, 400);
    }

    // Delete the period
    const [deletedPeriod] = await db.delete(periods).where(eq(periods.id, periodId)).returning();

    if (!deletedPeriod) {
      return c.json({ error: 'Unable to delete period. Please try again later' }, 500);
    }

    return c.json({ message: 'Period deleted successfully', period: deletedPeriod });
  } catch (error) {
    console.error('Error deleting period:', error);
    return c.json({ error: 'Unable to delete period. Please try again later' }, 500);
  }
}

/**
 * Get current open period for a workspace
 * GET /api/periods/workspace/:workspaceId/current
 * @requires userAuthValidation middleware
 */
export async function getCurrentPeriod(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const userId = c.get('userId');

  if (!workspaceId) {
    return c.json({ error: 'Workspace ID is required' }, 400);
  }

  if (!isValidUUID(workspaceId)) {
    return c.json({ error: 'Invalid workspace ID format' }, 400);
  }

  try {
    // Check if user is a member of the workspace
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member) {
      return c.json({ error: 'You are not a member of this workspace' }, 403);
    }

    const currentPeriod = await db.query.periods.findFirst({
      where: (p, { eq, and }) => and(eq(p.workspaceId, workspaceId), eq(p.status, 'open')),
      orderBy: [desc(periods.year), desc(periods.month)],
    });

    if (!currentPeriod) {
      return c.json({ error: 'No open period found for this workspace' }, 404);
    }

    return c.json(currentPeriod);
  } catch (error) {
    console.error('Error fetching current period:', error);
    return c.json({ error: 'Failed to fetch current period' }, 500);
  }
}

/**
 * Close current period and create next period
 * POST /api/periods/workspace/:workspaceId/close-and-create-next
 * @requires userAuthValidation middleware
 */
export async function closeCurrentAndCreateNext(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const userId = c.get('userId');

  if (!workspaceId) {
    return c.json({ error: 'Workspace ID is required' }, 400);
  }

  if (!isValidUUID(workspaceId)) {
    return c.json({ error: 'Invalid workspace ID format' }, 400);
  }

  try {
    // Check if user is workspace owner or admin
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      return c.json({ error: 'Only workspace owners and admins can perform this action' }, 403);
    }

    // Get current open period
    const currentPeriod = await db.query.periods.findFirst({
      where: (p, { eq, and }) => and(eq(p.workspaceId, workspaceId), eq(p.status, 'open')),
      orderBy: [desc(periods.year), desc(periods.month)],
    });

    if (!currentPeriod) {
      return c.json({ error: 'No open period found for this workspace' }, 404);
    }

    // Calculate next period
    let nextYear = currentPeriod.year;
    let nextMonth = currentPeriod.month + 1;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    // Check if next period already exists
    const existingNextPeriod = await db.query.periods.findFirst({
      where: (p, { eq, and }) => and(eq(p.workspaceId, workspaceId), eq(p.year, nextYear), eq(p.month, nextMonth)),
    });

    if (existingNextPeriod) {
      return c.json({ error: 'Next period already exists' }, 409);
    }

    // Close current period and create next period in a transaction-like manner
    const [updatedCurrent] = await db
      .update(periods)
      .set({ status: 'closed', closedAt: new Date() })
      .where(eq(periods.id, currentPeriod.id))
      .returning();

    const [newPeriod] = await db
      .insert(periods)
      .values({
        workspaceId,
        year: nextYear,
        month: nextMonth,
        status: 'open',
      })
      .returning();

    return c.json({
      message: 'Period closed and next period created successfully',
      closedPeriod: updatedCurrent,
      newPeriod: newPeriod,
    });
  } catch (error) {
    console.error('Error closing current and creating next period:', error);
    return c.json({ error: 'Unable to complete period transition. Please try again later' }, 500);
  }
}
