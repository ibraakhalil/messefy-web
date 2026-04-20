import type { Context } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { deposits } from '../db/schemas';
import { isValidUUID } from '../utils/validators';
import {
  ensureOpenPeriod,
  getScopedDeposit,
  requireScopedPeriod,
  requireScopedPeriodManager,
  requireTargetMember,
  requireWorkspaceMember,
  requireWorkspaceManager,
} from '../utils/workspace-access';

function parseAmount(amount: unknown) {
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return null;
  }

  return parsedAmount.toFixed(2);
}

export async function createDeposit(c: Context) {
  const { workspaceId, periodId, memberId, amount, note } = await c.req.json();
  const userId = c.get('userId');

  if (!workspaceId || !periodId || !memberId || amount === undefined) {
    return c.json({ error: 'workspaceId, periodId, memberId and amount are required' }, 400);
  }

  if (!isValidUUID(workspaceId) || !isValidUUID(periodId) || !isValidUUID(memberId)) {
    return c.json({ error: 'Invalid workspace, period, or member ID format' }, 400);
  }

  const parsedAmount = parseAmount(amount);

  if (!parsedAmount) {
    return c.json({ error: 'Amount must be a positive number' }, 400);
  }

  try {
    const { period } = await requireScopedPeriodManager(periodId, userId);

    if (period.workspaceId !== workspaceId) {
      return c.json({ error: 'Period does not belong to the provided workspace' }, 400);
    }

    ensureOpenPeriod(period.status);
    await requireTargetMember(workspaceId, memberId);

    const [deposit] = await db
      .insert(deposits)
      .values({
        workspaceId,
        periodId,
        memberId,
        amount: parsedAmount,
        note: typeof note === 'string' && note.trim() ? note.trim() : null,
      })
      .returning();

    return c.json({ message: 'Deposit created successfully', deposit }, 201);
  } catch (error) {
    console.error('Error creating deposit:', error);
    throw error;
  }
}

export async function getDepositsByPeriod(c: Context) {
  const periodId = c.req.param('periodId');
  const userId = c.get('userId');

  if (!periodId || !isValidUUID(periodId)) {
    return c.json({ error: 'Invalid period ID' }, 400);
  }

  try {
    const { period } = await requireScopedPeriod(periodId, userId);

    const periodDeposits = await db.query.deposits.findMany({
      where: (depositTable, { eq }) => eq(depositTable.periodId, period.id),
      orderBy: (depositTable, { desc }) => [desc(depositTable.createdAt)],
      with: {
        member: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return c.json(periodDeposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    throw error;
  }
}

export async function getDepositsByMember(c: Context) {
  const { periodId, memberId } = c.req.param();
  const userId = c.get('userId');

  if (!periodId || !memberId || !isValidUUID(periodId) || !isValidUUID(memberId)) {
    return c.json({ error: 'Invalid period or member ID' }, 400);
  }

  try {
    const { period } = await requireScopedPeriod(periodId, userId);
    await requireTargetMember(period.workspaceId, memberId);

    const memberDeposits = await db.query.deposits.findMany({
      where: (depositTable, { eq, and }) =>
        and(eq(depositTable.periodId, period.id), eq(depositTable.memberId, memberId)),
      orderBy: (depositTable, { desc }) => [desc(depositTable.createdAt)],
    });

    return c.json(memberDeposits);
  } catch (error) {
    console.error('Error fetching member deposits:', error);
    throw error;
  }
}

export async function updateDeposit(c: Context) {
  const depositId = c.req.param('depositId');
  const { memberId, amount, note } = await c.req.json();
  const userId = c.get('userId');

  if (!depositId || !isValidUUID(depositId)) {
    return c.json({ error: 'Invalid deposit ID' }, 400);
  }

  try {
    const deposit = await getScopedDeposit(depositId);
    await requireWorkspaceManager(deposit.workspaceId, userId);

    const { period } = await requireScopedPeriod(deposit.periodId, userId);
    ensureOpenPeriod(period.status);

    let nextMemberId = deposit.memberId;
    if (memberId !== undefined) {
      if (!isValidUUID(memberId)) {
        return c.json({ error: 'Invalid member ID format' }, 400);
      }

      await requireTargetMember(deposit.workspaceId, memberId);
      nextMemberId = memberId;
    }

    const nextAmount = amount === undefined ? deposit.amount : parseAmount(amount);

    if (!nextAmount) {
      return c.json({ error: 'Amount must be a positive number' }, 400);
    }

    const [updatedDeposit] = await db
      .update(deposits)
      .set({
        memberId: nextMemberId,
        amount: nextAmount,
        note: typeof note === 'string' ? note.trim() || null : deposit.note,
      })
      .where(eq(deposits.id, depositId))
      .returning();

    return c.json({ message: 'Deposit updated successfully', deposit: updatedDeposit });
  } catch (error) {
    console.error('Error updating deposit:', error);
    throw error;
  }
}

export async function deleteDeposit(c: Context) {
  const depositId = c.req.param('depositId');
  const userId = c.get('userId');

  if (!depositId || !isValidUUID(depositId)) {
    return c.json({ error: 'Invalid deposit ID' }, 400);
  }

  try {
    const deposit = await getScopedDeposit(depositId);
    await requireWorkspaceManager(deposit.workspaceId, userId);

    const { period } = await requireScopedPeriod(deposit.periodId, userId);
    ensureOpenPeriod(period.status);

    await db.delete(deposits).where(eq(deposits.id, depositId));
    return c.json({ message: 'Deposit deleted successfully' });
  } catch (error) {
    console.error('Error deleting deposit:', error);
    throw error;
  }
}
