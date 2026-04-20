import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { adjustments, deposits, expenses, mealEntries, periods } from '../db/schemas';
import { getCurrentOpenPeriod, requireScopedPeriod } from './workspace-access';

function toAmount(value: string | number | null | undefined) {
  return Number(value ?? 0);
}

function toMealCount(entry: { breakfast: number; lunch: number; dinner: number }) {
  return entry.breakfast + entry.lunch + entry.dinner;
}

function roundAmount(value: number) {
  return Number(value.toFixed(2));
}

async function buildSummary(periodId: string) {
  const period = await db.query.periods.findFirst({
    where: (periodTable, { eq }) => eq(periodTable.id, periodId),
  });

  if (!period) {
    throw new Error('Period not found');
  }

  const [workspaceMembers, periodMeals, periodDeposits, periodExpenses, periodAdjustments] =
    await Promise.all([
      db.query.members.findMany({
        where: (memberTable, { eq, and }) =>
          and(eq(memberTable.workspaceId, period.workspaceId), eq(memberTable.isActive, true)),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.query.mealEntries.findMany({
        where: (mealTable, { eq }) => eq(mealTable.periodId, periodId),
        orderBy: [desc(mealEntries.date)],
      }),
      db.query.deposits.findMany({
        where: (depositTable, { eq }) => eq(depositTable.periodId, periodId),
        orderBy: [desc(deposits.createdAt)],
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
      }),
      db.query.expenses.findMany({
        where: (expenseTable, { eq }) => eq(expenseTable.periodId, periodId),
        orderBy: [desc(expenses.createdAt)],
      }),
      db.query.adjustments.findMany({
        where: (adjustmentTable, { eq }) => eq(adjustmentTable.periodId, periodId),
      }),
    ]);

  const mealCountsByMember = new Map<string, number>();
  const depositsByMember = new Map<string, number>();
  const adjustmentsByMember = new Map<string, number>();

  for (const entry of periodMeals) {
    mealCountsByMember.set(entry.memberId, (mealCountsByMember.get(entry.memberId) ?? 0) + toMealCount(entry));
  }

  for (const deposit of periodDeposits) {
    depositsByMember.set(deposit.memberId, (depositsByMember.get(deposit.memberId) ?? 0) + toAmount(deposit.amount));
  }

  for (const adjustment of periodAdjustments) {
    adjustmentsByMember.set(
      adjustment.memberId,
      (adjustmentsByMember.get(adjustment.memberId) ?? 0) + toAmount(adjustment.amount),
    );
  }

  const totalMeals = periodMeals.reduce((sum, entry) => sum + toMealCount(entry), 0);
  const totalDeposits = roundAmount(periodDeposits.reduce((sum, deposit) => sum + toAmount(deposit.amount), 0));
  const totalExpenses = roundAmount(periodExpenses.reduce((sum, expense) => sum + toAmount(expense.amount), 0));
  const mealExpenses = roundAmount(
    periodExpenses
      .filter((expense) => expense.allocationType === 'by_meals')
      .reduce((sum, expense) => sum + toAmount(expense.amount), 0),
  );
  const totalAdjustments = roundAmount(
    periodAdjustments.reduce((sum, adjustment) => sum + toAmount(adjustment.amount), 0),
  );
  const mealRate = totalMeals > 0 ? roundAmount(mealExpenses / totalMeals) : 0;

  const members = workspaceMembers
    .map((member) => {
      const memberMeals = mealCountsByMember.get(member.id) ?? 0;
      const memberDeposits = roundAmount(depositsByMember.get(member.id) ?? 0);
      const memberAdjustments = roundAmount(adjustmentsByMember.get(member.id) ?? 0);
      const byMealsShare = roundAmount(memberMeals * mealRate);
      const totalDue = roundAmount(byMealsShare - memberAdjustments);
      const balance = roundAmount(memberDeposits - totalDue);

      return {
        memberId: member.id,
        userId: member.userId,
        name: member.name ?? member.user?.name ?? 'Offline member',
        email: member.user?.email ?? null,
        role: member.role,
        isOffline: member.isOffline,
        meals: memberMeals,
        deposits: memberDeposits,
        adjustments: memberAdjustments,
        due: totalDue,
        balance,
      };
    })
    .sort((left, right) => left.balance - right.balance);

  const totalDue = roundAmount(members.reduce((sum, member) => sum + member.due, 0));
  const recentDeposits = periodDeposits.slice(0, 10).map((deposit) => ({
    id: deposit.id,
    memberId: deposit.memberId,
    memberName:
      deposit.member.name ?? deposit.member.user?.name ?? deposit.member.user?.email ?? 'Offline member',
    amount: roundAmount(toAmount(deposit.amount)),
    note: deposit.note,
    createdAt: deposit.createdAt,
  }));
  const recentExpenses = periodExpenses.slice(0, 10).map((expense) => ({
    id: expense.id,
    title: expense.title,
    amount: roundAmount(toAmount(expense.amount)),
    allocationType: expense.allocationType,
    note: expense.note,
    createdAt: expense.createdAt,
  }));

  return {
    period: {
      id: period.id,
      workspaceId: period.workspaceId,
      year: period.year,
      month: period.month,
      status: period.status,
      createdAt: period.createdAt,
      closedAt: period.closedAt,
    },
    totals: {
      memberCount: workspaceMembers.length,
      totalMeals,
      totalDeposits,
      totalExpenses,
      mealExpenses,
      totalAdjustments,
      totalDue,
      mealRate,
      netBalance: roundAmount(totalDeposits - totalDue),
    },
    members,
    recentDeposits,
    recentExpenses,
  };
}

export async function buildPeriodSummary(periodId: string, userId: string) {
  await requireScopedPeriod(periodId, userId);
  return buildSummary(periodId);
}

export async function buildCurrentWorkspaceSummary(workspaceId: string, userId: string) {
  const currentPeriod = await getCurrentOpenPeriod(workspaceId, userId);
  return buildSummary(currentPeriod.id);
}
