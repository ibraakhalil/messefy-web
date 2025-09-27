import { sql } from 'drizzle-orm';
import { timestamp, pgTable, varchar, uuid, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { workspaces } from './workspace.schema';

export const members = pgTable('members', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id)
    .notNull(),
  userId: uuid('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'owner', 'manager', 'member'
  isOffline: boolean('is_offline').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
