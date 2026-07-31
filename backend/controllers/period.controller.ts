import type { Context } from 'hono';
import { db } from '../db';
import { deposits, expenses, mealEntries, members, periods } from '../db/schemas';
import { and, desc, eq, getTableColumns, ne, sql } from 'drizzle-orm';
import { isValidUUID, isValidYear, isValidMonth, isValidPeriodStatus } from '../utils/validators';

export async function createPeriod(c: Context) {
  const { workspaceId, year, month, managerId } = await c.req.json();
  const userId = c.get('userId');

  if (!workspaceId || !year || !month || !managerId) {
    return c.json({ error: 'Missing required fields: workspaceId, year, month, and managerId must be provided' }, 400);
  }

  if (!isValidUUID(workspaceId) || !isValidUUID(managerId)) {
    return c.json({ error: 'Invalid workspace ID or manager ID format' }, 400);
  }

  if (!isValidYear(year)) {
    return c.json({ error: 'Year must be between 1900 and 2100' }, 400);
  }

  if (!isValidMonth(month)) {
    return c.json({ error: 'Month must be between 1 and 12' }, 400);
  }

  try {
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member) {
      return c.json({ error: 'You are not a member of this workspace' }, 403);
    }

    const workspace = await db.query.workspaces.findFirst({
      where: (w, { eq, and }) => and(eq(w.id, workspaceId), eq(w.isActive, true)),
    });

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    const [activePeriod, existingPeriod, latestPeriod] = await Promise.all([
      db.query.periods.findFirst({
        where: (p, { eq, and }) => and(eq(p.workspaceId, workspaceId), eq(p.status, 'open')),
      }),
      db.query.periods.findFirst({
        where: (p, { eq, and }) => and(eq(p.workspaceId, workspaceId), eq(p.year, year), eq(p.month, month)),
      }),
      db.query.periods.findFirst({
        where: (p, { eq }) => eq(p.workspaceId, workspaceId),
        orderBy: [desc(periods.year), desc(periods.month)],
      }),
    ]);

    if (activePeriod) {
      return c.json({ error: 'Close the active period before creating a new one' }, 409);
    }

    if (existingPeriod) {
      return c.json({ error: 'A period already exists for this workspace and month/year combination' }, 409);
    }

    if (latestPeriod && year * 12 + month <= latestPeriod.year * 12 + latestPeriod.month) {
      return c.json({ error: 'A new period must be later than the latest existing period' }, 409);
    }

    const [period] = await db
      .insert(periods)
      .values({
        workspaceId,
        year,
        month,
        status: 'open',
        managerId,
      })
      .returning();

    if (!period) {
      return c.json({ error: 'Unable to create period. Please try again later' }, 500);
    }

    const member2 = await db.query.members.findFirst({
      where: (m, { eq }) => eq(m.id, managerId),
    });

    if (member2 && member2.role !== 'owner') {
      await db.update(members).set({ role: 'manager' }).where(eq(members.id, managerId));
    }

    return c.json({ message: 'Period created successfully', period }, 201);
  } catch (error) {
    console.error('Error creating period:', error);
    return c.json({ error: 'Unable to create period. Please try again later' }, 500);
  }
}

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
    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member) {
      return c.json({ error: 'You are not a member of this workspace' }, 403);
    }

    const depositTotals = db
      .select({
        periodId: deposits.periodId,
        total: sql<number>`sum(${deposits.amount})`.mapWith(Number).as('total_deposits'),
      })
      .from(deposits)
      .where(eq(deposits.workspaceId, workspaceId))
      .groupBy(deposits.periodId)
      .as('deposit_totals');

    const expenseTotals = db
      .select({
        periodId: expenses.periodId,
        total: sql<number>`sum(${expenses.amount})`.mapWith(Number).as('total_expenses'),
        mealTotal: sql<number>`sum(${expenses.amount}) filter (where ${expenses.allocationType} = 'by_meals')`
          .mapWith(Number)
          .as('meal_expenses'),
      })
      .from(expenses)
      .where(eq(expenses.workspaceId, workspaceId))
      .groupBy(expenses.periodId)
      .as('expense_totals');

    const mealTotals = db
      .select({
        periodId: mealEntries.periodId,
        total:
          sql<number>`sum(${mealEntries.breakfast} + ${mealEntries.lunch} + ${mealEntries.dinner})`
            .mapWith(Number)
            .as('total_meals'),
      })
      .from(mealEntries)
      .where(eq(mealEntries.workspaceId, workspaceId))
      .groupBy(mealEntries.periodId)
      .as('meal_totals');

    const periodsList = await db
      .select({
        ...getTableColumns(periods),
        totalDeposits: sql<number>`coalesce(${depositTotals.total}, 0)`.mapWith(Number),
        totalExpenses: sql<number>`coalesce(${expenseTotals.total}, 0)`.mapWith(Number),
        totalMeals: sql<number>`coalesce(${mealTotals.total}, 0)`.mapWith(Number),
        mealRate:
          sql<number>`case when coalesce(${mealTotals.total}, 0) > 0 then round(coalesce(${expenseTotals.mealTotal}, 0) / ${mealTotals.total}, 2) else 0 end`.mapWith(
            Number,
          ),
      })
      .from(periods)
      .leftJoin(depositTotals, eq(depositTotals.periodId, periods.id))
      .leftJoin(expenseTotals, eq(expenseTotals.periodId, periods.id))
      .leftJoin(mealTotals, eq(mealTotals.periodId, periods.id))
      .where(eq(periods.workspaceId, workspaceId))
      .orderBy(desc(periods.year), desc(periods.month));

    return c.json({ periods: periodsList, count: periodsList.length });
  } catch (error) {
    console.error('Error fetching periods:', error);
    return c.json({ error: 'Failed to fetch periods' }, 500);
  }
}

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
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
      with: {
        workspace: true,
      },
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    const member = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, period.workspaceId), eq(m.userId, userId), eq(m.isActive, true)),
    });

    if (!member || member.role !== 'owner') {
      return c.json({ error: 'Only workspace owners can update periods' }, 403);
    }

    if (status === 'open') {
      const latestPeriod = await db.query.periods.findFirst({
        where: (p, { eq }) => eq(p.workspaceId, period.workspaceId),
        orderBy: [desc(periods.year), desc(periods.month)],
      });

      if (latestPeriod?.id !== period.id) {
        return c.json({ error: 'Only the latest period can be reopened' }, 409);
      }
    }

    const updatedPeriod = await db.transaction(async (tx) => {
      if (status === 'open') {
        await tx
          .update(periods)
          .set({ status: 'closed', closedAt: new Date() })
          .where(
            and(eq(periods.workspaceId, period.workspaceId), eq(periods.status, 'open'), ne(periods.id, periodId)),
          );
      }

      const [updated] = await tx
        .update(periods)
        .set({
          status,
          closedAt: status === 'closed' ? new Date() : null,
        })
        .where(eq(periods.id, periodId))
        .returning();

      return updated;
    });

    if (!updatedPeriod) {
      return c.json({ error: 'Unable to update period. Please try again later' }, 500);
    }

    const manager = await db.query.members.findFirst({
      where: (m, { eq }) => eq(m.id, period.managerId),
    });

    if (manager && manager.role !== 'owner') {
      await db.update(members).set({ role: 'member' }).where(eq(members.id, period.managerId));
    }

    return c.json({ message: 'Period updated successfully', period: updatedPeriod });
  } catch (error) {
    console.error('Error updating period:', error);
    return c.json({ error: 'Unable to update period. Please try again later' }, 500);
  }
}

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

    if (period.status === 'closed') {
      return c.json({ error: 'Cannot delete a closed period' }, 400);
    }

    const [deletedPeriod] = await db.delete(periods).where(eq(periods.id, periodId)).returning();

    if (!deletedPeriod) {
      return c.json({ error: 'Unable to delete period. Please try again later' }, 500);
    }

    // When a period is deleted, change the manager's role back to member if they're not an owner
    const manager = await db.query.members.findFirst({
      where: (m, { eq }) => eq(m.id, period.managerId),
    });

    if (manager && manager.role !== 'owner') {
      await db.update(members).set({ role: 'member' }).where(eq(members.id, period.managerId));
    }

    return c.json({ message: 'Period deleted successfully', period: deletedPeriod });
  } catch (error) {
    console.error('Error deleting period:', error);
    return c.json({ error: 'Unable to delete period. Please try again later' }, 500);
  }
}

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
