import { sql } from 'drizzle-orm';
import { text, timestamp, pgTable, varchar, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password'),

  name: varchar('name', { length: 255 }).notNull(),
  avatar: text('avatar'),

  emailVerified: timestamp('email_verified', { mode: 'date' }),
  isActive: boolean('is_active').default(true).notNull(),

  googleId: varchar('google_id', { length: 255 }).unique(),
  lastLoginAt: timestamp('last_login_at', { mode: 'date' }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  preferredLanguage: varchar('preferred_language', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
