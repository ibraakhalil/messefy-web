import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { userRoute } from './user.route';
import { authRoute } from './auth.route';
import { workspaceRoute } from './workspace.route';
import { invitationRoute } from './invitation.route';
import { memberRoute } from './member.route';

const router = new Hono();

router.route('/', userRoute);
router.route('/auth', authRoute);
router.route('/workspaces', workspaceRoute);
router.route('/invitation', invitationRoute);
router.route('/members', memberRoute);

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

export default router;
