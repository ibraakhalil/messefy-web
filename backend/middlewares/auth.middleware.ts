import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { env } from '../config/env';

export const ownerCheck = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');

  const payload = await verify(token, env.JWT_SECRET!);

  if (!payload) return c.json({ error: 'Unauthorized' }, 401);

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
