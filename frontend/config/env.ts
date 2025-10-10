export const env = {
  NEXT_PUBLIC_ROOT_DOMAIN: process.env.ROOT_DOMAIN || 'localhost:3000',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  API_INTERNAL_URL: process.env.API_INTERNAL_URL || 'http://localhost:5000',
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
