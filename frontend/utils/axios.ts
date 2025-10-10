// lib/api.ts
import axios from 'axios';
import { env } from '@/config/env';
import { getSession } from 'next-auth/react';
import { auth } from '@/config/auth';

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const session = typeof window === 'undefined' ? await auth() : await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  },
);

export default api;
