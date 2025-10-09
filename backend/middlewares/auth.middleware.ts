import type { Context, Next } from 'hono';

export const ownerCheck = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization');

  console.log('Owner Token:', token);

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
};
