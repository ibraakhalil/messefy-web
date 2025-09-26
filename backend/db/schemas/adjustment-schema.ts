import { sql } from 'drizzle-orm';
import { text, timestamp, pgTable, uuid, decimal } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace-schema';
import { members } from './member-schema';
import { periods } from './period-schema';

export const adjustments = pgTable('adjustments', {
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
  note: text('note').notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Adjustment = typeof adjustments.$inferSelect;
export type NewAdjustment = typeof adjustments.$inferInsert;
