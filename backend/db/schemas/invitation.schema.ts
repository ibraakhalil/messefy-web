import { sql } from 'drizzle-orm';
import { timestamp, pgTable, varchar, uuid } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.schema';

export const invitations = pgTable('invitations', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id)
    .notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  usedAt: timestamp('used_at', { mode: 'date' }),
});

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
