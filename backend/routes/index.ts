import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { userRoute } from './user.route';
import { Auth } from '@auth/core';
import { authConfig } from '../config/auth';

const router = new Hono();

router.route('/', userRoute);

router.notFound((c) => c.json({ message: 'Abracadabra! The page you are looking for does not exist.' }, 404));

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

router.all('/api/auth/*', async (c) => {
  const request = c.req.raw;
  const response = await Auth(request, authConfig);

  // Copy headers from Auth.js response
  response.headers.forEach((value, key) => {
    c.header(key, value);
  });

  return c.body(await response.text(), response.status as any);
});

// Get session endpoint for client-side
router.get('/api/session', async (c) => {
  const request = c.req.raw;
  const url = new URL('/api/auth/session', request.url);
  const sessionRequest = new Request(url, {
    headers: request.headers,
  });

  const response = await Auth(sessionRequest, authConfig);
  const session = await response.json();

  return c.json(session);
});

export default router;
