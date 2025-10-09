import type { Context } from 'hono';
import { db } from '../db';
import { workspaces } from '../db/schemas';

export async function createWorkspace(c: Context) {
  const { name, subdomain, description, ownerId } = await c.req.json();

  // Validate required fields
  if (!name || !subdomain || !ownerId) {
    return c.json({ error: 'Name, subdomain and ownerId are required' }, 400);
  }

  // Check if subdomain is already taken
  const existingWorkspace = await db.query.workspaces.findFirst({
    where: (w, { eq }) => eq(w.subdomain, subdomain),
  });

  if (existingWorkspace) {
    return c.json({ error: 'Subdomain already taken' }, 409);
  }

  try {
    // Create new workspace
    const [newWorkspace] = await db.insert(workspaces).values({ name, subdomain, description, ownerId }).returning();

    if (!newWorkspace) {
      return c.json({ error: 'Failed to create workspace' }, 500);
    }

    return c.json(
      {
        message: 'Workspace created successfully',
        workspace: newWorkspace,
      },
      201,
    );
  } catch (error) {
    console.error('Error creating workspace:', error);
    return c.json({ error: 'Failed to create workspace' }, 500);
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
