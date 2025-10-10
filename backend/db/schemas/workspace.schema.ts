import { sql } from 'drizzle-orm';
import { text, timestamp, pgTable, varchar, uuid, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const workspaces = pgTable('workspaces', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 63 }).unique().notNull(),
  description: text('description'),

  ownerId: uuid('owner_id')
    .references(() => users.id)
    .notNull(),
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
