import type { Context } from 'hono';
import { db } from '../db';
import { workspaces } from '../db/schemas';

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

export async function getWorkspaceById(c: Context) {
  const workspaceId = c.req.param('id');

  // Validate workspace ID
  if (!workspaceId) {
    return c.json({ error: 'Workspace ID is required' }, 400);
  }

  try {
    // Find workspace
    const workspace = await db.query.workspaces.findFirst({
      where: (w, { eq, and }) => and(eq(w.id, workspaceId), eq(w.isActive, true)),
    });

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    return c.json({ workspace });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return c.json({ error: 'Failed to fetch workspace' }, 500);
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
