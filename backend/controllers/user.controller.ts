import type { Context } from 'hono';
import { db } from '../db';
import { users } from '../db/schemas';
import { eq } from 'drizzle-orm';

export async function getCurrentUser(c: Context) {
  const userId = c.get('userId');

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const user = await db.query.users.findFirst({
      where: (currentUser, { and, eq }) => and(eq(currentUser.id, userId), eq(currentUser.isActive, true)),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user, 200);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return c.json({ error: 'Failed to fetch current user' }, 500);
  }
}

export async function updateCurrentUser(c: Context) {
  const userId = c.get('userId');
  const body = await c.req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (name.length < 2) {
    return c.json({ error: 'Name must be at least 2 characters long' }, 400);
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(updatedUser, 200);
  } catch (error) {
    console.error('Error updating current user:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
}
