import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db';
import { users } from '../db/schemas';
import { eq } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  const userss = await db.select().from(users).where(eq(users.preferredLanguage, 'bn')).limit(1000);
  return c.json(userss);
});

// Handle 404
router.notFound((c) => c.json({ message: 'Abracadabra! The page you are looking for does not exist.' }, 404));

// Handle errors
router.onError((err, c) => {
  console.error('Server Error:', err);

  const status = err instanceof HTTPException ? err.status : 500;
  const message = err instanceof HTTPException ? err.message : 'Internal server error';

  return c.json(
    {
      status: 'error',
      code: status,
      message,
      ...(process.env.NODE_ENV !== 'production' && status === 500 && { error: err.message }),
    },
    status,
  );
});

export default router;
