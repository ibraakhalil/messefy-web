import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import router from './routes';

const app = new Hono();

app.use('*', logger());
app.use(
  '/*',
  cors({
    origin: (origin) => {
      if (
        !origin ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('192.168.') ||
        origin.includes('10.0.2.2') ||
        origin.includes('tauri.localhost')
      ) {
        return origin || '*';
      }
      return process.env.FRONTEND_URL || 'http://localhost:3333';
    },
    credentials: true,
  }),
);
app.route('/', router);

const port = process.env.PORT || 5555;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
