import { timestamp, pgTable, varchar, uuid } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.schema';
import { users } from './users.schema';
import { sql } from 'drizzle-orm';

export const invitations = pgTable('invitations', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
