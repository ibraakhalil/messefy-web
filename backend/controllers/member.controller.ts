import type { Context } from 'hono';
import { db } from '../db';
import { members } from '../db/schemas';
import { eq } from 'drizzle-orm';

export async function addUserInWorkspace(c: Context) {
  const email = c.req.param('email');
  const workspaceId = c.req.param('workspaceId');

  try {
    const user = await db.query.users.findFirst({
      where: (u, { eq, and }) => and(eq(u.email, email), eq(u.isActive, true)),
      with: {
        member: {
          columns: {
            id: true,
            workspaceId: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (!user.member) {
      await db.insert(members).values({
        userId: user.id,
        workspaceId,
        isActive: true,
        role: 'member',
      });
      return c.json(user, 200);
    }

    if (!user.member.isActive) {
      await db.update(members).set({ isActive: true }).where(eq(members.id, user.member.id));
      return c.json(user, 200);
    }

    return c.json({ error: 'User already connected a workspace' }, 403);
  } catch (error) {
    console.error('Error checking member workspace:', error);
    return c.json({ error: 'Failed to check member workspace' }, 500);
  }
}
