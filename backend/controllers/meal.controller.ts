import type { Context } from 'hono';
import { db } from '../db';
import { mealEntries, periods, members } from '../db/schemas';
import { eq, and, desc } from 'drizzle-orm';
import { isValidUUID, isValidDate } from '../utils/validators';

export async function createMealEntry(c: Context) {
  const { workspaceId, periodId, memberId, date, breakfast, lunch, dinner } = await c.req.json();
  const authUserId = c.get('userId');

  if (!workspaceId || !periodId || !memberId || !date) {
    return c.json({ error: 'Missing required fields: workspaceId, periodId, memberId, and date' }, 400);
  }

  if (!isValidUUID(workspaceId) || !isValidUUID(periodId) || !isValidUUID(memberId)) {
    return c.json({ error: 'Invalid ID format' }, 400);
  }

  try {
    // Verify membership
    const authMember = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, authUserId), eq(m.isActive, true)),
    });

    if (!authMember) {
      return c.json({ error: 'You are not a member of this workspace' }, 403);
    }

    // Verify period exists and is open
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    if (period.status !== 'open') {
      return c.json({ error: 'Cannot add meals to a closed period' }, 400);
    }

    // Verify member exists in workspace
    const targetMember = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.id, memberId), eq(m.workspaceId, workspaceId)),
    });

    if (!targetMember) {
      return c.json({ error: 'Target member not found in this workspace' }, 404);
    }

    // Check if meal entry already exists for this date and member
    const existingEntry = await db.query.mealEntries.findFirst({
      where: (me, { eq, and }) =>
        and(eq(me.workspaceId, workspaceId), eq(me.periodId, periodId), eq(me.memberId, memberId), eq(me.date, date)),
    });

    if (existingEntry) {
      return c.json({ error: 'Meal entry already exists for this date' }, 409);
    }

    const [newEntry] = await db
      .insert(mealEntries)
      .values({
        workspaceId,
        periodId,
        memberId,
        date,
        breakfast: breakfast || 0,
        lunch: lunch || 0,
        dinner: dinner || 0,
      })
      .returning();

    return c.json({ message: 'Meal entry created successfully', entry: newEntry }, 201);
  } catch (error) {
    console.error('Error creating meal entry:', error);
    return c.json({ error: 'Unable to create meal entry' }, 500);
  }
}

export async function createBatchMealEntries(c: Context) {
  const { workspaceId, periodId, date, meals } = await c.req.json();
  const authUserId = c.get('userId');

  if (!workspaceId || !periodId || !date || !Array.isArray(meals) || meals.length === 0) {
    return c.json({ error: 'Missing required fields or invalid meals array' }, 400);
  }

  if (!isValidUUID(workspaceId) || !isValidUUID(periodId)) {
    return c.json({ error: 'Invalid ID format' }, 400);
  }

  try {
    // Verify actions permissions (Manager/Admin/Owner)
    const authMember = await db.query.members.findFirst({
      where: (m, { eq, and }) => and(eq(m.workspaceId, workspaceId), eq(m.userId, authUserId), eq(m.isActive, true)),
    });

    if (!authMember) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const isManager = ['owner', 'admin', 'manager'].includes(authMember.role);
    if (!isManager) {
      return c.json({ error: 'Only managers can perform batch entries' }, 403);
    }

    // Verify period exists and is open
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    if (period.status !== 'open') {
      return c.json({ error: 'Cannot add meals to a closed period' }, 400);
    }

    // Process meals in transaction
    await db.transaction(async (tx) => {
      for (const meal of meals) {
        const { memberId, breakfast, lunch, dinner } = meal;

        if (!memberId || !isValidUUID(memberId)) continue;

        // Check if entry exists
        const existingEntry = await tx.query.mealEntries.findFirst({
          where: (me, { eq, and }) =>
            and(
              eq(me.workspaceId, workspaceId),
              eq(me.periodId, periodId),
              eq(me.memberId, memberId),
              eq(me.date, date),
            ),
        });

        if (existingEntry) {
          // Update
          await tx
            .update(mealEntries)
            .set({
              breakfast: breakfast !== undefined ? breakfast : existingEntry.breakfast,
              lunch: lunch !== undefined ? lunch : existingEntry.lunch,
              dinner: dinner !== undefined ? dinner : existingEntry.dinner,
            })
            .where(eq(mealEntries.id, existingEntry.id));
        } else {
          // Insert
          await tx.insert(mealEntries).values({
            workspaceId,
            periodId,
            memberId,
            date,
            breakfast: breakfast || 0,
            lunch: lunch || 0,
            dinner: dinner || 0,
          });
        }
      }
    });

    return c.json({ message: 'Batch meal entries processed successfully' }, 201);
  } catch (error) {
    console.error('Error batch creating meal entries:', error);
    return c.json({ error: 'Unable to process batch meal entries' }, 500);
  }
}

export async function getMealEntriesByPeriod(c: Context) {
  const periodId = c.req.param('periodId');
  const authUserId = c.get('userId');

  if (!periodId || !isValidUUID(periodId)) {
    return c.json({ error: 'Invalid period ID' }, 400);
  }

  try {
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    // Verify access
    const authMember = await db.query.members.findFirst({
      where: (m, { eq, and }) =>
        and(eq(m.workspaceId, period.workspaceId), eq(m.userId, authUserId), eq(m.isActive, true)),
    });

    if (!authMember) {
      return c.json({ error: 'You are not authorized to view this period' }, 403);
    }

    const entries = await db.query.mealEntries.findMany({
      where: (me, { eq }) => eq(me.periodId, periodId),
      orderBy: [desc(mealEntries.date)],
      with: {
        member: {
          with: {
            user: true,
          },
        },
      },
    });

    return c.json(entries);
  } catch (error) {
    console.error('Error fetching meal entries:', error);
    return c.json({ error: 'Failed to fetch meal entries' }, 500);
  }
}

export async function getMealEntriesByMember(c: Context) {
  const { periodId, memberId } = c.req.param();
  const authUserId = c.get('userId');

  if (!periodId || !memberId || !isValidUUID(periodId) || !isValidUUID(memberId)) {
    return c.json({ error: 'Invalid IDs' }, 400);
  }

  try {
    const period = await db.query.periods.findFirst({
      where: (p, { eq }) => eq(p.id, periodId),
    });

    if (!period) {
      return c.json({ error: 'Period not found' }, 404);
    }

    // Verify access
    const authMember = await db.query.members.findFirst({
      where: (m, { eq, and }) =>
        and(eq(m.workspaceId, period.workspaceId), eq(m.userId, authUserId), eq(m.isActive, true)),
    });

    if (!authMember) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const entries = await db.query.mealEntries.findMany({
      where: (me, { eq, and }) => and(eq(me.periodId, periodId), eq(me.memberId, memberId)),
      orderBy: [desc(mealEntries.date)],
    });

    return c.json(entries);
  } catch (error) {
    console.error('Error fetching member meals:', error);
    return c.json({ error: 'Failed to fetch member meals' }, 500);
  }
}

export async function getMealEntryById(c: Context) {
  const mealId = c.req.param('mealId');
  const authUserId = c.get('userId');

  if (!mealId || !isValidUUID(mealId)) {
    return c.json({ error: 'Invalid meal ID' }, 400);
  }

  try {
    const entry = await db.query.mealEntries.findFirst({
      where: (me, { eq }) => eq(me.id, mealId),
      with: {
        period: true,
      },
    });

    if (!entry) {
      return c.json({ error: 'Meal entry not found' }, 404);
    }

    const authMember = await db.query.members.findFirst({
      where: (m, { eq, and }) =>
        and(eq(m.workspaceId, entry.workspaceId), eq(m.userId, authUserId), eq(m.isActive, true)),
    });

    if (!authMember) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    return c.json(entry);
  } catch (error) {
    console.error('Error fetching meal entry:', error);
    return c.json({ error: 'Failed to fetch meal entry' }, 500);
  }
}

export async function updateMealEntry(c: Context) {
  const mealId = c.req.param('mealId');
  const { breakfast, lunch, dinner } = await c.req.json();
  const authUserId = c.get('userId');

  if (!mealId || !isValidUUID(mealId)) {
    return c.json({ error: 'Invalid meal ID' }, 400);
  }

  try {
    const entry = await db.query.mealEntries.findFirst({
      where: (me, { eq }) => eq(me.id, mealId),
      with: {
        period: true,
      },
    });

    if (!entry) {
      return c.json({ error: 'Meal entry not found' }, 404);
    }

    if (entry.period.status !== 'open') {
      return c.json({ error: 'Cannot update meals in a closed period' }, 400);
    }

    const authMember = await db.query.members.findFirst({
      where: (m, { eq, and }) =>
        and(eq(m.workspaceId, entry.workspaceId), eq(m.userId, authUserId), eq(m.isActive, true)),
    });

    if (!authMember) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Check permissions: Owner/Admin/Manager or the member themselves
    const isSelf = authMember.id === entry.memberId;
    const isManager = ['owner', 'admin', 'manager'].includes(authMember.role);

    if (!isSelf && !isManager) {
      return c.json({ error: 'You do not have permission to update this entry' }, 403);
    }

    const [updatedEntry] = await db
      .update(mealEntries)
      .set({
        breakfast: breakfast !== undefined ? breakfast : entry.breakfast,
        lunch: lunch !== undefined ? lunch : entry.lunch,
        dinner: dinner !== undefined ? dinner : entry.dinner,
      })
      .where(eq(mealEntries.id, mealId))
      .returning();

    return c.json({ message: 'Meal entry updated', entry: updatedEntry });
  } catch (error) {
    console.error('Error updating meal entry:', error);
    return c.json({ error: 'Failed to update meal entry' }, 500);
  }
}

export async function deleteMealEntry(c: Context) {
  const mealId = c.req.param('mealId');
  const authUserId = c.get('userId');

  if (!mealId || !isValidUUID(mealId)) {
    return c.json({ error: 'Invalid meal ID' }, 400);
  }

  try {
    const entry = await db.query.mealEntries.findFirst({
      where: (me, { eq }) => eq(me.id, mealId),
      with: {
        period: true,
      },
    });

    if (!entry) {
      return c.json({ error: 'Meal entry not found' }, 404);
    }

    if (entry.period.status !== 'open') {
      return c.json({ error: 'Cannot delete meals in a closed period' }, 400);
    }

    const authMember = await db.query.members.findFirst({
      where: (m, { eq, and }) =>
        and(eq(m.workspaceId, entry.workspaceId), eq(m.userId, authUserId), eq(m.isActive, true)),
    });

    if (!authMember) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Check permissions: Owner/Admin/Manager or the member themselves
    const isSelf = authMember.id === entry.memberId;
    const isManager = ['owner', 'admin', 'manager'].includes(authMember.role);

    if (!isSelf && !isManager) {
      return c.json({ error: 'You do not have permission to delete this entry' }, 403);
    }

    await db.delete(mealEntries).where(eq(mealEntries.id, mealId));

    return c.json({ message: 'Meal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal entry:', error);
    return c.json({ error: 'Failed to delete meal entry' }, 500);
  }
}
