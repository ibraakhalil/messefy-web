// routes/user.ts
import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schemas';

export const testRoute = new Hono();

testRoute.get('/', async (c) => {
  try {
    const allUsers = await db.select().from(users);
    return c.json(allUsers);
  } catch (e) {
    console.error('Error fetching users:', e);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
