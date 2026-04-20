import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { workspaces } from './workspace.schema';
import { invitations } from './invitation.schema';
import { members } from './member.schema';
import { periods } from './period.schema';
import { mealEntries } from './meal.schema';
import { adjustments } from './adjustment.schema';
import { deposits, expenses } from './transaction.schema';

export const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [invitations.workspaceId],
    references: [workspaces.id],
  }),
}));

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}));

export const workspaceRelations = relations(workspaces, ({ many }) => ({
  periods: many(periods),
  mealEntries: many(mealEntries),
  deposits: many(deposits),
  expenses: many(expenses),
  adjustments: many(adjustments),
}));

export const periodsRelations = relations(periods, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [periods.workspaceId],
    references: [workspaces.id],
  }),
  mealEntries: many(mealEntries),
  deposits: many(deposits),
  expenses: many(expenses),
  adjustments: many(adjustments),
}));

export const mealEntriesRelations = relations(mealEntries, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [mealEntries.workspaceId],
    references: [workspaces.id],
  }),
  period: one(periods, {
    fields: [mealEntries.periodId],
    references: [periods.id],
  }),
  member: one(members, {
    fields: [mealEntries.memberId],
    references: [members.id],
  }),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [deposits.workspaceId],
    references: [workspaces.id],
  }),
  period: one(periods, {
    fields: [deposits.periodId],
    references: [periods.id],
  }),
  member: one(members, {
    fields: [deposits.memberId],
    references: [members.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [expenses.workspaceId],
    references: [workspaces.id],
  }),
  period: one(periods, {
    fields: [expenses.periodId],
    references: [periods.id],
  }),
}));

export const adjustmentsRelations = relations(adjustments, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [adjustments.workspaceId],
    references: [workspaces.id],
  }),
  period: one(periods, {
    fields: [adjustments.periodId],
    references: [periods.id],
  }),
  member: one(members, {
    fields: [adjustments.memberId],
    references: [members.id],
  }),
}));

export const userRelations = relations(users, ({ one }) => ({
  member: one(members, {
    fields: [users.id],
    references: [members.userId],
  }),
}));
