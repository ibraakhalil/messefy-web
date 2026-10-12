import axios from 'axios';
import { env } from '@/config/env';
import { getSession } from 'next-auth/react';
import { auth } from '@/config/auth';

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

//Server & Client Aware Axios Interceptors
api.interceptors.request.use(
  async (config) => {
    // When executing server-side (Node/Next.js SSR), use internal Docker network
    if (typeof window === 'undefined') {
      const internalBase = process.env.API_INTERNAL_URL || env.API_INTERNAL_URL || 'http://backend:5555';
      config.baseURL = internalBase;
    }

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
