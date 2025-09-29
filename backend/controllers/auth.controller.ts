import type { Context } from 'hono';
import { db } from '../db';
import { users } from '../db/schemas';

export async function userRegistration(c: Context) {
  const { email, password, name } = await c.req.json();

  console.log(email, password, name);

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

  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const isPasswordValid = user.password === password;

  if (!isPasswordValid) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    emailVerified: user.emailVerified,
  });
}

export async function userSync(c: Context) {
  const { email, name, image, emailVerified } = await c.req.json();

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existing) {
    return c.json({ ok: true, existed: true });
  }

  await db.insert(users).values({
    email,
    name,
    image,
    emailVerified: emailVerified ? new Date(emailVerified) : null,
  });

  return c.json({ ok: true, existed: false });
}
