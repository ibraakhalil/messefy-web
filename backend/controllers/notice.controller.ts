import type { Context } from 'hono';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { notices } from '../db/schemas';
import { isValidUUID } from '../utils/validators';
import { requireWorkspaceMember, requireWorkspaceManager } from '../utils/workspace-access';

export async function getWorkspaceNotices(c: Context) {
  const workspaceId = c.req.param('workspaceId');
  const userId = c.get('userId');

  if (!workspaceId || !isValidUUID(workspaceId)) {
    return c.json({ error: 'Valid workspace ID is required' }, 400);
  }

  try {
    // Ensure requesting user is an active member of this mess
    await requireWorkspaceMember(workspaceId, userId);

    const activeOnly = c.req.query('all') !== 'true';

    const conditions = activeOnly
      ? and(eq(notices.workspaceId, workspaceId), eq(notices.isActive, true))
      : eq(notices.workspaceId, workspaceId);

    const list = await db.query.notices.findMany({
      where: conditions,
      orderBy: [desc(notices.createdAt)],
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json({ notices: list });
  } catch (error: any) {
    console.error('Error fetching notices:', error);
    return c.json({ error: error.message || 'Failed to fetch notices' }, error.status || 500);
  }
}

export async function createNotice(c: Context) {
  const userId = c.get('userId');
  const { workspaceId, title, content, priority = 'normal' } = await c.req.json();

  if (!workspaceId || !title || !content) {
    return c.json({ error: 'workspaceId, title, and content are required' }, 400);
  }

  if (!isValidUUID(workspaceId)) {
    return c.json({ error: 'Invalid workspace ID' }, 400);
  }

  const cleanTitle = String(title).trim();
  const cleanContent = String(content).trim();
  const validPriorities = ['normal', 'important', 'urgent'];
  const finalPriority = validPriorities.includes(priority) ? priority : 'normal';

  if (!cleanTitle) {
    return c.json({ error: 'Title cannot be empty' }, 400);
  }

  if (!cleanContent) {
    return c.json({ error: 'Content cannot be empty' }, 400);
  }

  try {
    // Only mess owners or managers can post notices
    await requireWorkspaceManager(workspaceId, userId);

    const [newNotice] = await db
      .insert(notices)
      .values({
        workspaceId,
        authorId: userId,
        title: cleanTitle,
        content: cleanContent,
        priority: finalPriority,
        isActive: true,
      })
      .returning();

    if (!newNotice) {
      return c.json({ error: 'Failed to create notice' }, 500);
    }

    // Fetch with author name
    const createdNotice = await db.query.notices.findFirst({
      where: eq(notices.id, newNotice.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json(
      {
        message: 'নোটিস সফলভাবে পোস্ট করা হয়েছে',
        notice: createdNotice || newNotice,
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating notice:', error);
    return c.json({ error: error.message || 'Failed to create notice' }, error.status || 500);
  }
}

export async function updateNotice(c: Context) {
  const userId = c.get('userId');
  const noticeId = c.req.param('noticeId');

  if (!noticeId || !isValidUUID(noticeId)) {
    return c.json({ error: 'Invalid notice ID' }, 400);
  }

  try {
    const existing = await db.query.notices.findFirst({
      where: eq(notices.id, noticeId),
    });

    if (!existing) {
      return c.json({ error: 'Notice not found' }, 404);
    }

    // Require manager role in the workspace
    await requireWorkspaceManager(existing.workspaceId, userId);

    const body = await c.req.json();
    const updateData: Partial<typeof notices.$inferInsert> = {};

    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.content !== undefined) updateData.content = String(body.content).trim();
    if (body.priority !== undefined) {
      const validPriorities = ['normal', 'important', 'urgent'];
      if (validPriorities.includes(body.priority)) {
        updateData.priority = body.priority;
      }
    }
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const [updated] = await db
      .update(notices)
      .set(updateData)
      .where(eq(notices.id, noticeId))
      .returning();

    return c.json({
      message: 'নোটিস আপডেট করা হয়েছে',
      notice: updated,
    });
  } catch (error: any) {
    console.error('Error updating notice:', error);
    return c.json({ error: error.message || 'Failed to update notice' }, error.status || 500);
  }
}

export async function deleteNotice(c: Context) {
  const userId = c.get('userId');
  const noticeId = c.req.param('noticeId');

  if (!noticeId || !isValidUUID(noticeId)) {
    return c.json({ error: 'Invalid notice ID' }, 400);
  }

  try {
    const existing = await db.query.notices.findFirst({
      where: eq(notices.id, noticeId),
    });

    if (!existing) {
      return c.json({ error: 'Notice not found' }, 404);
    }

    // Require manager role in the workspace
    await requireWorkspaceManager(existing.workspaceId, userId);

    await db.delete(notices).where(eq(notices.id, noticeId));

    return c.json({ message: 'নোটিস মুছে ফেলা হয়েছে' });
  } catch (error: any) {
    console.error('Error deleting notice:', error);
    return c.json({ error: error.message || 'Failed to delete notice' }, error.status || 500);
  }
}
