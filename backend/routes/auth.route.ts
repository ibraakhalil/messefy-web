import { Hono } from 'hono';
import { loginWithCredentials, userRegistration, userSync } from '../controllers/auth.controller';

export const authRoute = new Hono();

// Registration
authRoute.post('/signup', userRegistration);
authRoute.post('/register', userRegistration);

// Login
authRoute.post('/signin', loginWithCredentials);
authRoute.post('/login', loginWithCredentials);

// User Sync (OAuth / NextAuth sync)
authRoute.post('/sync-user', userSync);
