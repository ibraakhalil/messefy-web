import type { Context } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { expenses } from '../db/schemas';
import { isValidUUID } from '../utils/validators';
import {
  ensureOpenPeriod,
  getScopedExpense,
  requireScopedPeriod,
  requireScopedPeriodManager,
  requireWorkspaceManager,
} from '../utils/workspace-access';

function parseAmount(amount: unknown) {
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return null;
  }

  return parsedAmount.toFixed(2);
}

function parseAllocationType(allocationType: unknown) {
  const normalized = typeof allocationType === 'string' ? allocationType : 'by_meals';

  if (normalized !== 'by_meals') {
    return null;
  }

  return normalized;
}

export async function createExpense(c: Context) {
  const { workspaceId, periodId, title, amount, note, allocationType } = await c.req.json();
  const userId = c.get('userId');

  if (!workspaceId || !periodId || !title || amount === undefined) {
    return c.json({ error: 'workspaceId, periodId, title and amount are required' }, 400);
  }

  if (!isValidUUID(workspaceId) || !isValidUUID(periodId)) {
    return c.json({ error: 'Invalid workspace or period ID format' }, 400);
  }

  const parsedAmount = parseAmount(amount);
  const parsedAllocationType = parseAllocationType(allocationType);

  if (!parsedAmount) {
    return c.json({ error: 'Amount must be a positive number' }, 400);
  }

  if (!parsedAllocationType) {
    return c.json({ error: 'Only by_meals allocation is supported right now' }, 400);
  }

  try {
    const { period } = await requireScopedPeriodManager(periodId, userId);

    if (period.workspaceId !== workspaceId) {
      return c.json({ error: 'Period does not belong to the provided workspace' }, 400);
    }

    ensureOpenPeriod(period.status);

    const [expense] = await db
      .insert(expenses)
      .values({
        workspaceId,
        periodId,
        title: title.trim(),
        amount: parsedAmount,
        allocationType: parsedAllocationType,
        note: typeof note === 'string' && note.trim() ? note.trim() : null,
      })
      .returning();

    return c.json({ message: 'Expense created successfully', expense }, 201);
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}

export async function getExpensesByPeriod(c: Context) {
  const periodId = c.req.param('periodId');
  const userId = c.get('userId');

  if (!periodId || !isValidUUID(periodId)) {
    return c.json({ error: 'Invalid period ID' }, 400);
  }

  try {
    const { period } = await requireScopedPeriod(periodId, userId);

    const periodExpenses = await db.query.expenses.findMany({
      where: (expenseTable, { eq }) => eq(expenseTable.periodId, period.id),
      orderBy: (expenseTable, { desc }) => [desc(expenseTable.createdAt)],
    });

    return c.json(periodExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export async function updateExpense(c: Context) {
  const expenseId = c.req.param('expenseId');
  const { title, amount, note, allocationType } = await c.req.json();
  const userId = c.get('userId');

  if (!expenseId || !isValidUUID(expenseId)) {
    return c.json({ error: 'Invalid expense ID' }, 400);
  }

  try {
    const expense = await getScopedExpense(expenseId);
    await requireWorkspaceManager(expense.workspaceId, userId);

    const { period } = await requireScopedPeriod(expense.periodId, userId);
    ensureOpenPeriod(period.status);

    const nextAmount = amount === undefined ? expense.amount : parseAmount(amount);
    const nextAllocationType =
      allocationType === undefined ? expense.allocationType : parseAllocationType(allocationType);

    if (!nextAmount) {
      return c.json({ error: 'Amount must be a positive number' }, 400);
    }

    if (!nextAllocationType) {
      return c.json({ error: 'Only by_meals allocation is supported right now' }, 400);
    }

    const [updatedExpense] = await db
      .update(expenses)
      .set({
        title: typeof title === 'string' && title.trim() ? title.trim() : expense.title,
        amount: nextAmount,
        allocationType: nextAllocationType,
        note: typeof note === 'string' ? note.trim() || null : expense.note,
      })
      .where(eq(expenses.id, expenseId))
      .returning();

    return c.json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

export async function deleteExpense(c: Context) {
  const expenseId = c.req.param('expenseId');
  const userId = c.get('userId');

  if (!expenseId || !isValidUUID(expenseId)) {
    return c.json({ error: 'Invalid expense ID' }, 400);
  }

  try {
    const expense = await getScopedExpense(expenseId);
    await requireWorkspaceManager(expense.workspaceId, userId);

    const { period } = await requireScopedPeriod(expense.periodId, userId);
    ensureOpenPeriod(period.status);

    await db.delete(expenses).where(eq(expenses.id, expenseId));
    return c.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}
