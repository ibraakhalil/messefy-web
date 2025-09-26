import { sql } from 'drizzle-orm';
import { timestamp, pgTable, uuid, integer, date } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace-schema';
import { members } from './member-schema';
import { periods } from './period-schema';

export const mealEntries = pgTable('meal_entries', {
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
  date: date('date').notNull(),

  breakfast: integer('breakfast').default(0).notNull(),
  lunch: integer('lunch').default(0).notNull(),
  dinner: integer('dinner').default(0).notNull(),
  guestMeals: integer('guest_meals').default(0).notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type MealEntry = typeof mealEntries.$inferSelect;
export type NewMealEntry = typeof mealEntries.$inferInsert;
