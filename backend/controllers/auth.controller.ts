import type { Context } from 'hono';
import { db } from '../db';
import { users } from '../db/schemas';
import { sign } from 'hono/jwt';
import { env } from '../config/env';

export async function userRegistration(c: Context) {
  const { email, password, name } = await c.req.json();

  if (!email || !password || !name) {
    return c.json({ error: 'Email, password and name are required' }, 400);
  }

  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existingUser) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password,
      name,
      isActive: true,
    })
    .returning();

  if (!newUser) {
    return c.json({ error: 'Failed to create user' }, 500);
  }

  return c.json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    emailVerified: newUser.emailVerified,
    image: newUser.image,
  });
}

export async function loginWithCredentials(c: Context) {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (!user || user.password !== password) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const userData = { id: user.id, email: user.email, name: user.name, image: user.image };
  const token = await sign({ id: user.id, email: user.email }, env.JWT_SECRET!);

  return c.json({
    ...userData,
    emailVerified: user.emailVerified,
    token,
  });
}

export async function userSync(c: Context) {
  try {
    const body = await c.req.json();

    const [user] = await db
      .insert(users)
      .values({
        ...body,
        emailVerified: body.emailVerified ? new Date(body.emailVerified) : null,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { name: body.name, image: body.image, updatedAt: new Date() },
      })
      .returning();

    const token = await sign({ id: user?.id, email: user?.email }, process.env.JWT_SECRET!);

    return c.json({ ok: true, token, user });
  } catch (error) {
    return c.json({ ok: false, error: 'Failed to sync user' }, 500);
  }
}
