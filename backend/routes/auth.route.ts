import { Hono } from 'hono';
import { loginWithCredentials, userRegistration, userSync } from '../controllers/auth.controller';

export const authRoute = new Hono();

authRoute.post('/signup', userRegistration);

authRoute.post('/signin', loginWithCredentials);

authRoute.post('/sync-user', userSync);
