import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { env } from '../config/env';
import { db } from '../db';

export const ownerCheck = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  const workspaceId = c.req.param('workspaceId');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');

  const payload = await verify(token, env.JWT_SECRET!);

  if (!payload) return c.json({ error: 'Unauthorized' }, 401);

  const workspace = await db.query.workspaces.findFirst({
    where: (w, { eq, and }) => and(eq(w.id, workspaceId), eq(w.ownerId, payload.id as string)),
  });

  if (!workspace) return c.json({ error: 'Unauthorized' }, 401);

  c.set('ownerId', payload.id);
  await next();
};

export const userAuthValidation = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');

  const payload = await verify(token, env.JWT_SECRET!);

  if (!payload) return c.json({ error: 'Unauthorized' }, 401);

  c.set('userId', payload.id);
  await next();
};
