import { sql } from 'drizzle-orm';
import { text, timestamp, pgTable, varchar, uuid, boolean } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.schema';
import { users } from './users.schema';

export const notices = pgTable('notices', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  authorId: uuid('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  priority: varchar('priority', { length: 32 }).default('normal').notNull(), // 'normal' | 'important' | 'urgent'
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Notice = typeof notices.$inferSelect;
export type NewNotice = typeof notices.$inferInsert;
