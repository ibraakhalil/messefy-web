import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const sessions = pgTable('sessions', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  expires: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
