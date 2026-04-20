import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { users, members } from '../db/schemas';

function getUniqueUserIds(userIds: Array<string | null | undefined>) {
  return [...new Set(userIds.filter((userId): userId is string => Boolean(userId)))];
}

async function getStillAttachedUserIds(offlineUserIds: string[]) {
  if (offlineUserIds.length === 0) {
    return new Set<string>();
  }

  const activeMembers = await db.query.members.findMany({
    where: (member, { and, eq, inArray }) =>
      and(inArray(member.userId, offlineUserIds), eq(member.isActive, true)),
    columns: {
      userId: true,
    },
  });

  return new Set(
    activeMembers
      .map((member) => member.userId)
      .filter((userId): userId is string => Boolean(userId)),
  );
}

export async function deactivateDetachedOfflineUsers(userIds: Array<string | null | undefined>) {
  const offlineUserIds = getUniqueUserIds(userIds);

  if (offlineUserIds.length === 0) {
    return;
  }

  const attachedUserIds = await getStillAttachedUserIds(offlineUserIds);
  const detachedUserIds = offlineUserIds.filter((userId) => !attachedUserIds.has(userId));

  if (detachedUserIds.length === 0) {
    return;
  }

  await db
    .update(users)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(inArray(users.id, detachedUserIds), eq(users.isActive, true)));
}

export async function deleteDetachedOfflineUsers(userIds: Array<string | null | undefined>) {
  const offlineUserIds = getUniqueUserIds(userIds);

  if (offlineUserIds.length === 0) {
    return;
  }

  const attachedUserIds = await getStillAttachedUserIds(offlineUserIds);
  const detachedUserIds = offlineUserIds.filter((userId) => !attachedUserIds.has(userId));

  if (detachedUserIds.length === 0) {
    return;
  }

  await db.delete(users).where(inArray(users.id, detachedUserIds));
}

export async function getOfflineUserIdsByWorkspace(workspaceId: string) {
  const workspaceMembers = await db.query.members.findMany({
    where: (member, { and, eq }) =>
      and(eq(member.workspaceId, workspaceId), eq(member.isOffline, true)),
    columns: {
      userId: true,
    },
  });

  return getUniqueUserIds(workspaceMembers.map((member) => member.userId));
}
