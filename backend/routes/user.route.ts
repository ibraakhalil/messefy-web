// routes/user.ts
import { Hono } from 'hono';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { isValidUUID } from '../utils/validators';
import { users } from '../db/schemas';

export const userRoute = new Hono();

userRoute.get('/users', async (c) => {
  try {
    const allUsers = await db.select().from(users);
    return c.json(allUsers);
  } catch (e) {
    console.error('Error fetching users:', e);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

userRoute.get('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');

    if (!isValidUUID(id)) {
      return c.json({ error: 'Invalid UUID format' }, 400);
    }

    const allUsers = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (allUsers.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(allUsers[0]);
  } catch (e) {
    console.error('Error fetching user:', e);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
