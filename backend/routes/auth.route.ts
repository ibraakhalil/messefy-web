import { Hono } from 'hono';
import { loginWithCredentials, userRegistration, userSync } from '../controllers/auth.controller';

export const authRoute = new Hono();

authRoute.post('/signup', userRegistration);

authRoute.post('/login', loginWithCredentials);

authRoute.post('/sync-user', userSync);
