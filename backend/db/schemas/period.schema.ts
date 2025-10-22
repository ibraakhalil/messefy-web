import { sql } from 'drizzle-orm';
import { timestamp, pgTable, uuid, integer, pgEnum } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.schema';
import { members } from './member.schema';

// Period status enum
export const periodStatusEnum = pgEnum('period_status', ['open', 'closed']);

export const periods = pgTable('periods', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id)
    .notNull(),
  year: integer('year').notNull(),
  month: integer('month').notNull(), // 1-12
  status: periodStatusEnum('status').default('open').notNull(),
  managerId: uuid('manager_id')
    .references(() => members.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  closedAt: timestamp('closed_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Period = typeof periods.$inferSelect;
export type NewPeriod = typeof periods.$inferInsert;
