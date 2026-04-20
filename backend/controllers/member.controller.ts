import type { Context } from 'hono';
import { db } from '../db';
import { members, users } from '../db/schemas';
import { eq, and } from 'drizzle-orm';

const OFFLINE_DEFAULT_PASSWORD = '12345678';

function buildOfflineEmailBase(name: string) {
  const normalized = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 12);

  return normalized || 'member';
}

async function generateOfflineEmail(name: string) {
  const emailBase = buildOfflineEmailBase(name);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const email = `${emailBase}${suffix}@mess.com`;

    const existingUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
      columns: {
        id: true,
      },
    });

    if (!existingUser) {
      return email;
    }
  }

  throw new Error('Unable to generate a unique offline member email');
}

async function createOfflineMember(workspaceId: string, name: string) {
  return db.transaction(async (tx) => {
    const generatedEmail = await generateOfflineEmail(name);

    const [newUser] = await tx
      .insert(users)
      .values({
        email: generatedEmail,
        password: OFFLINE_DEFAULT_PASSWORD,
        name,
        isActive: true,
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create offline member user');
    }

    const [newMember] = await tx
      .insert(members)
      .values({
        userId: newUser.id,
        workspaceId,
        name,
        role: 'member',
        isOffline: true,
        isActive: true,
      })
      .returning();

    if (!newMember) {
      throw new Error('Failed to create offline member');
    }

    return {
      member: newMember,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      generatedCredentials: {
        email: generatedEmail,
        password: OFFLINE_DEFAULT_PASSWORD,
      },
    };
  });
}

export async function addUserInWorkspace(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const body = await c.req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const memberType = body.type === 'offline' ? 'offline' : 'online';

  if (!workspaceId) {
    return c.json({ error: 'Workspace ID is required' }, 400);
  }

  if (memberType === 'offline') {
    if (!name) {
      return c.json({ error: 'Name is required for offline members' }, 400);
    }

    try {
      const offlineMember = await createOfflineMember(workspaceId, name);
      return c.json(offlineMember, 201);
    } catch (error) {
      console.error('Error creating offline member:', error);
      return c.json({ error: 'Failed to create offline member' }, 500);
    }
  }

  if (!email) {
    return c.json({ error: 'Email is required for online members' }, 400);
  }

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
      const [newMember] = await db
        .insert(members)
        .values({
          userId: user.id,
          workspaceId,
          isActive: true,
          role: 'member',
        })
        .returning();

      return c.json({ member: newMember, user, generatedCredentials: null }, 201);
    }

    if (!user.member.isActive) {
      await db.update(members).set({ isActive: true }).where(eq(members.id, user.member.id));
      return c.json({ member: user.member, user, generatedCredentials: null }, 200);
    }

    return c.json({ error: 'User already connected a workspace' }, 403);
  } catch (error) {
    console.error('Error checking member workspace:', error);
    return c.json({ error: 'Failed to check member workspace' }, 500);
  }
}

export async function leaveWorkspace(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const userId = c.get('userId');

  try {
    // Find the member record
    const member = await db.query.members.findFirst({
      where: and(eq(members.userId, userId), eq(members.workspaceId, workspaceId)),
    });

    if (!member || member.role === 'owner') {
      return c.json({ error: 'Something went wrong' }, 404);
    }

    if (member.isOffline) {
      return c.json({ error: 'Offline members can only be removed by the mess owner' }, 403);
    }

    // Soft delete by setting isActive to false
    await db.update(members).set({ isActive: false }).where(eq(members.id, member.id));

    return c.json({ message: 'Successfully left workspace' }, 200);
  } catch (error) {
    console.error('Error leaving workspace:', error);
    return c.json({ error: 'Failed to leave workspace' }, 500);
  }
}
