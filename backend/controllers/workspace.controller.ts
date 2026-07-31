import type { Context } from 'hono';
import { db } from '../db';
import {
  adjustments,
  deposits,
  expenses,
  invitations,
  mealEntries,
  members,
  periods,
  users,
  workspaces,
} from '../db/schemas';
import { requireWorkspaceMember } from '../utils/workspace-access';
import { and, eq } from 'drizzle-orm';
import { deleteDetachedOfflineUsers, getOfflineUserIdsByWorkspace } from '../utils/offline-user';

export async function createWorkspace(c: Context) {
  const { name, slug, description } = await c.req.json();
  const userId = c.get('userId');

  if (!name || !slug || !userId) {
    return c.json({ error: 'Missing required fields: name, slug, and owner ID must be provided' }, 400);
  }

  const slugExists = await db.query.workspaces.findFirst({
    where: (w, { eq }) => eq(w.slug, slug),
  });

  if (slugExists) {
    return c.json({ error: 'This slug is already in use' }, 409);
  }

  const activeWorkspace = await db.query.workspaces.findFirst({
    where: (w, { eq, and }) => and(eq(w.ownerId, userId), eq(w.isActive, true)),
  });

  if (activeWorkspace) {
    return c.json({ error: 'You already own an active workspace' }, 409);
  }

  try {
    const [workspace] = await db.insert(workspaces).values({ name, slug, description, ownerId: userId }).returning();

    if (!workspace) {
      return c.json({ error: 'Unable to create workspace. Please try again later' }, 500);
    }

    await db.insert(members).values({
      workspaceId: workspace.id,
      userId: userId,
      role: 'owner',
    });

    return c.json({ message: 'Workspace created successfully', workspace }, 201);
  } catch (error) {
    console.error('Error creating workspace:', error);
    return c.json({ error: 'Unable to create workspace. Please try again later' }, 500);
  }
}

export async function updateWorkspace(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const ownerId = c.get('ownerId');
  const body: unknown = await c.req.json().catch(() => null);

  if (!workspaceId || !ownerId) {
    return c.json({ error: 'Workspace ID and owner ID are required' }, 400);
  }

  if (typeof body !== 'object' || body === null) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  const { name, description } = body as Record<string, unknown>;
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedDescription = typeof description === 'string' ? description.trim() : '';

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    return c.json({ error: 'Workspace name must be between 2 and 100 characters' }, 400);
  }

  if (normalizedDescription.length > 500) {
    return c.json({ error: 'Workspace description cannot exceed 500 characters' }, 400);
  }

  try {
    const [workspace] = await db
      .update(workspaces)
      .set({ name: normalizedName, description: normalizedDescription || null })
      .where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId), eq(workspaces.isActive, true)))
      .returning();

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    return c.json(workspace, 200);
  } catch (error) {
    console.error('Error updating workspace:', error);
    return c.json({ error: 'Failed to update workspace' }, 500);
  }
}

export async function deleteWorkspace(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const ownerId = c.get('ownerId');
  const { password } = await c.req.json().catch(() => ({}));

  if (!workspaceId || !ownerId) {
    return c.json({ error: 'Workspace ID and owner ID are required' }, 400);
  }

  if (!password || typeof password !== 'string') {
    return c.json({ error: 'Password is required' }, 400);
  }

  try {
    const [workspace, owner, offlineUserIds] = await Promise.all([
      db.query.workspaces.findFirst({
        where: (workspace, { and, eq }) =>
          and(eq(workspace.id, workspaceId), eq(workspace.ownerId, ownerId), eq(workspace.isActive, true)),
        columns: {
          id: true,
        },
      }),
      db.query.users.findFirst({
        where: (user, { and, eq }) => and(eq(user.id, ownerId), eq(user.isActive, true)),
        columns: {
          id: true,
          password: true,
        },
      }),
      getOfflineUserIdsByWorkspace(workspaceId),
    ]);

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    if (!owner?.password || owner.password !== password) {
      return c.json({ error: 'Invalid password' }, 403);
    }

    await db.transaction(async (tx) => {
      await tx.delete(invitations).where(eq(invitations.workspaceId, workspaceId));
      await tx.delete(adjustments).where(eq(adjustments.workspaceId, workspaceId));
      await tx.delete(deposits).where(eq(deposits.workspaceId, workspaceId));
      await tx.delete(expenses).where(eq(expenses.workspaceId, workspaceId));
      await tx.delete(mealEntries).where(eq(mealEntries.workspaceId, workspaceId));
      await tx.delete(periods).where(eq(periods.workspaceId, workspaceId));
      await tx.delete(members).where(eq(members.workspaceId, workspaceId));
      await tx.delete(workspaces).where(eq(workspaces.id, workspaceId));
    });

    await deleteDetachedOfflineUsers(offlineUserIds);

    return c.json({ message: 'Workspace deleted successfully' }, 200);
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return c.json({ error: 'Failed to delete workspace' }, 500);
  }
}

export async function getValidWorkspaceMember(c: Context) {
  const userId = c.get('userId');

  try {
    const member = await db.query.members.findFirst({
      where: (w, { eq, and }) => and(eq(w.userId, userId), eq(w.isActive, true)),
      with: {
        workspace: true,
        user: {
          columns: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!member) {
      return c.json({ error: 'No active workspaces found for this user' }, 404);
    }

    return c.json(member);
  } catch (error) {
    console.error('Error fetching user workspaces:', error);
    return c.json({ error: 'Failed to fetch user workspaces' }, 500);
  }
}

export async function getWorkspaceMembers(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const userId = c.get('userId');

  try {
    await requireWorkspaceMember(workspaceId, userId);

    const members = await db.query.members.findMany({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.isActive, true)),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!members) {
      return c.json({ error: 'No members found for this workspace' }, 404);
    }

    return c.json(members);
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    return c.json({ error: 'Failed to fetch workspace members' }, 500);
  }
}

export async function getWorkspaceById(c: Context) {
  const workspaceId = c.req.param('workspaceId');

  if (!workspaceId) {
    return c.json({ error: 'Workspace ID is required' }, 400);
  }

  try {
    const workspace = await db.query.workspaces.findFirst({
      where: (w, { eq, and }) => and(eq(w.id, workspaceId), eq(w.isActive, true)),
    });

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    return c.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return c.json({ error: 'Failed to fetch workspace' }, 500);
  }
}

export async function setInvitationsByUser(c: Context) {
  const { workspaceId } = await c.req.json();
  const userId = c.get('userId');

  if (!workspaceId || !userId) {
    return c.json({ error: 'Workspace ID and user ID are required' }, 400);
  }

  try {
    const invitation = await db.query.invitations.findFirst({
      where: (i, { eq, and }) => and(eq(i.workspaceId, workspaceId), eq(i.userId, userId)),
    });

    if (invitation) {
      return c.json({ error: 'Invitation already sent' }, 409);
    }

    const workspace = await db.query.workspaces.findFirst({
      where: (w, { eq, and }) => and(eq(w.id, workspaceId), eq(w.isActive, true)),
    });

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    await db.insert(invitations).values({
      workspaceId,
      userId,
    });

    return c.json({ message: 'Member invitation sent successfully' }, 200);
  } catch (error) {
    console.error('Error setting member invitation:', error);
    return c.json({ error: 'Failed to set member invitation' }, 500);
  }
}

export async function getInvitationsByUser(c: Context) {
  const userId = c.get('userId');

  console.log('Check Invitation:', userId);

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400);
  }

  try {
    const userInvitations = await db.query.invitations.findFirst({
      where: (i, { eq }) => eq(i.userId, userId),
    });

    return c.json(userInvitations);
  } catch (error) {
    console.error('Error fetching user invitations:', error);
    return c.json({ error: 'Failed to fetch user invitations' }, 500);
  }
}

export async function cancelInvitationByUser(c: Context) {
  const userId = c.get('userId');
  const { invitationId } = c.req.param();

  if (!userId || !invitationId) {
    return c.json({ error: 'User ID and invitation ID are required' }, 400);
  }

  try {
    const invitation = await db.query.invitations.findFirst({
      where: (i, { eq, and }) => and(eq(i.id, invitationId), eq(i.userId, userId)),
    });

    if (!invitation) {
      return c.json({ error: 'Invitation not found or not authorized' }, 404);
    }

    await db.delete(invitations).where(eq(invitations.id, invitationId));

    return c.json({ message: 'Invitation cancelled successfully' }, 200);
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return c.json({ error: 'Failed to cancel invitation' }, 500);
  }
}

export async function cancelInvitationByOwner(c: Context) {
  const ownerId = c.get('ownerId');
  const { invitationId } = c.req.param();

  if (!ownerId || !invitationId) {
    return c.json({ error: 'Owner ID and invitation ID are required' }, 400);
  }

  try {
    const invitation = await db.query.invitations.findFirst({
      where: (i, { eq, and }) => and(eq(i.id, invitationId)),
    });

    if (!invitation) {
      return c.json({ error: 'Invitation not found or not authorized' }, 404);
    }

    await db.delete(invitations).where(eq(invitations.id, invitationId));

    return c.json({ message: 'Invitation withdrawn successfully' }, 200);
  } catch (error) {
    console.error('Error withdrawing invitation:', error);
    return c.json({ error: 'Failed to withdraw invitation' }, 500);
  }
}

export async function getWorkspaceInvitations(c: Context) {
  const workspaceId = c.req.param('workspaceId');

  if (!workspaceId) {
    return c.json({ error: 'Workspace ID is required' }, 400);
  }

  try {
    const invitations = await db.query.invitations.findMany({
      where: (i, { eq }) => eq(i.workspaceId, workspaceId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        workspace: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!invitations) {
      return c.json({ error: 'Invitation not found or not authorized' }, 404);
    }

    return c.json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return c.json({ error: 'Failed to fetch invitations' }, 500);
  }
}

export async function acceptInvitationByOwner(c: Context) {
  const ownerId = c.get('ownerId');
  const { invitationId } = c.req.param();

  if (!ownerId || !invitationId) {
    return c.json({ error: 'Owner ID and invitation ID are required' }, 400);
  }

  try {
    const invitation = await db.query.invitations.findFirst({
      where: (i, { eq, and }) => and(eq(i.id, invitationId)),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invitation) {
      return c.json({ error: 'Invitation not found or not authorized' }, 404);
    }

    const existingMember = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, invitation.workspaceId), eq(m.userId, invitation.userId)),
    });

    if (existingMember) {
      await db.update(members).set({ isActive: true }).where(eq(members.id, existingMember.id));
    } else {
      await db.insert(members).values({
        workspaceId: invitation.workspaceId,
        userId: invitation.userId,
        role: 'member',
      });
    }

    await db.delete(invitations).where(eq(invitations.id, invitationId));

    return c.json({ message: 'Invitation accepted successfully' }, 200);
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return c.json({ error: 'Failed to accept invitation' }, 500);
  }
}
