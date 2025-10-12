import type { Context } from 'hono';
import { db } from '../db';
import { invitations, workspaces } from '../db/schemas';
import { eq } from 'drizzle-orm';

export async function createWorkspace(c: Context) {
  const { name, slug, description } = await c.req.json();
  const ownerId = c.get('ownerId');

  if (!name || !slug || !ownerId) {
    return c.json(
      {
        error: 'Missing required fields: name, slug, and owner ID must be provided',
      },
      400,
    );
  }

  const workspaceWithSlug = await db.query.workspaces.findFirst({
    where: (w, { eq }) => eq(w.slug, slug),
  });

  if (workspaceWithSlug) {
    return c.json(
      {
        error: 'This slug is already in use',
      },
      409,
    );
  }

  const activeOwnerWorkspace = await db.query.workspaces.findFirst({
    where: (w, { eq, and }) => and(eq(w.ownerId, ownerId), eq(w.isActive, true)),
  });

  if (activeOwnerWorkspace) {
    return c.json(
      {
        error: 'You already own an active workspace',
      },
      409,
    );
  }

  try {
    const [createdWorkspace] = await db.insert(workspaces).values({ name, slug, description, ownerId }).returning();

    return c.json(
      {
        message: 'Workspace created successfully',
        workspace: createdWorkspace,
      },
      201,
    );
  } catch (error) {
    console.error('Error creating workspace:', error);
    return c.json(
      {
        error: 'Unable to create workspace. Please try again later',
      },
      500,
    );
  }
}

export async function getWorkspaceByUser(c: Context) {
  const userId = c.get('userId');

  try {
    const workspace = await db.query.workspaces.findFirst({
      where: (w, { eq, and }) => and(eq(w.ownerId, userId), eq(w.isActive, true)),
    });

    if (!workspace) {
      return c.json({ error: 'No active workspaces found for this user' }, 404);
    }

    return c.json({ workspace });
  } catch (error) {
    console.error('Error fetching user workspaces:', error);
    return c.json({ error: 'Failed to fetch user workspaces' }, 500);
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
