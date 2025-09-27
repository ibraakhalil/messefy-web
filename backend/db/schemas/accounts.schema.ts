import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const accounts = pgTable('accounts', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  type: varchar('type', { length: 50 }).notNull(), // oauth, email etc
  provider: varchar('provider', { length: 50 }).notNull(), // google, facebook
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),

  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: timestamp('expires_at', { mode: 'date' }),

  tokenType: varchar('token_type', { length: 50 }),
  scope: varchar('scope', { length: 255 }),
  idToken: text('id_token'),
  sessionState: varchar('session_state', { length: 255 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
