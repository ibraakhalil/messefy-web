import { sql } from 'drizzle-orm';
import { text, timestamp, pgTable, varchar, uuid, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace-schema';
import { members } from './member-schema';
import { periods } from './period-schema';

// Expense allocation type enum
export const expenseAllocationEnum = pgEnum('expense_allocation', ['by_meals', 'by_head', 'custom', 'personal']);

// Member deposits
export const deposits = pgTable('deposits', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id)
    .notNull(),
  periodId: uuid('period_id')
    .references(() => periods.id)
    .notNull(),
  memberId: uuid('member_id')
    .references(() => members.id)
    .notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  note: text('note'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Shared expenses
export const expenses = pgTable('expenses', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id)
    .notNull(),
  periodId: uuid('period_id')
    .references(() => periods.id)
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  allocationType: expenseAllocationEnum('allocation_type').default('by_meals').notNull(),
  note: text('note'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Deposit = typeof deposits.$inferSelect;
export type NewDeposit = typeof deposits.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
