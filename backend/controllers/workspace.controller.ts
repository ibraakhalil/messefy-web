import type { Context } from 'hono';
import { db } from '../db';
import { workspaces } from '../db/schemas';

export async function createWorkspace(c: Context) {
  const { name, subdomain, description } = await c.req.json();
  const ownerId = c.get('ownerId');

  if (!name || !subdomain || !ownerId) {
    return c.json(
      {
        error: 'Missing required fields: name, subdomain, and owner ID must be provided',
      },
      400,
    );
  }

  const workspaceWithSubdomain = await db.query.workspaces.findFirst({
    where: (w, { eq }) => eq(w.subdomain, subdomain),
  });
  if (workspaceWithSubdomain) {
    return c.json(
      {
        error: 'This subdomain is already in use',
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
    const [createdWorkspace] = await db
      .insert(workspaces)
      .values({ name, subdomain, description, ownerId })
      .returning();

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

export async function getUserWorkspaces(c: Context) {
  const userId = c.req.param('userId');

  // Validate user ID
  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400);
  }

  try {
    // Find all active workspaces owned by the user
    const userWorkspaces = await db.query.workspaces.findMany({
      where: (w, { eq, and }) => and(eq(w.ownerId, userId), eq(w.isActive, true)),
    });

    return c.json({ workspaces: userWorkspaces });
  } catch (error) {
    console.error('Error fetching user workspaces:', error);
    return c.json({ error: 'Failed to fetch user workspaces' }, 500);
  }
}
