import { and, desc, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { members, periods } from '../db/schemas';

const MANAGEABLE_ROLES = new Set(['owner', 'manager']);

export async function requireWorkspaceMember(workspaceId: string, userId: string) {
  const member = await db.query.members.findFirst({
    where: (memberTable, { eq, and }) =>
      and(eq(memberTable.workspaceId, workspaceId), eq(memberTable.userId, userId), eq(memberTable.isActive, true)),
  });

  if (!member) {
    throw new HTTPException(403, { message: 'You are not a member of this workspace' });
  }

  return member;
}

export async function requireWorkspaceManager(workspaceId: string, userId: string) {
  const member = await requireWorkspaceMember(workspaceId, userId);

  if (!MANAGEABLE_ROLES.has(member.role)) {
    throw new HTTPException(403, { message: 'Only owners or managers can perform this action' });
  }

  return member;
}

export async function requireTargetMember(workspaceId: string, memberId: string) {
  const member = await db.query.members.findFirst({
    where: (memberTable, { eq, and }) =>
      and(eq(memberTable.id, memberId), eq(memberTable.workspaceId, workspaceId), eq(memberTable.isActive, true)),
  });

  if (!member) {
    throw new HTTPException(404, { message: 'Member not found in this workspace' });
  }

  return member;
}

export async function requireScopedPeriod(periodId: string, userId: string) {
  const period = await db.query.periods.findFirst({
    where: (periodTable, { eq }) => eq(periodTable.id, periodId),
  });

  if (!period) {
    throw new HTTPException(404, { message: 'Period not found' });
  }

  const member = await requireWorkspaceMember(period.workspaceId, userId);
  return { period, member };
}

export async function requireScopedPeriodManager(periodId: string, userId: string) {
  const { period } = await requireScopedPeriod(periodId, userId);
  const member = await requireWorkspaceManager(period.workspaceId, userId);

  return { period, member };
}

export async function getCurrentOpenPeriod(workspaceId: string, userId: string) {
  await requireWorkspaceMember(workspaceId, userId);

  const period = await db.query.periods.findFirst({
    where: (periodTable, { eq, and }) => and(eq(periodTable.workspaceId, workspaceId), eq(periodTable.status, 'open')),
    orderBy: [desc(periods.year), desc(periods.month)],
  });

  if (!period) {
    throw new HTTPException(404, { message: 'No open period found for this workspace' });
  }

  return period;
}

export function ensureOpenPeriod(status: 'open' | 'closed') {
  if (status !== 'open') {
    throw new HTTPException(400, { message: 'This period is closed and cannot be modified' });
  }
}

export async function getScopedDeposit(depositId: string) {
  const deposit = await db.query.deposits.findFirst({
    where: (depositTable, { eq }) => eq(depositTable.id, depositId),
  });

  if (!deposit) {
    throw new HTTPException(404, { message: 'Deposit not found' });
  }

  return deposit;
}

export async function getScopedExpense(expenseId: string) {
  const expense = await db.query.expenses.findFirst({
    where: (expenseTable, { eq }) => eq(expenseTable.id, expenseId),
  });

  if (!expense) {
    throw new HTTPException(404, { message: 'Expense not found' });
  }

  return expense;
}
