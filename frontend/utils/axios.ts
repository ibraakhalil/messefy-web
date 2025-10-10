import axios from 'axios';
import { env } from '@/config/env';
import { getAuthToken, removeAuthToken } from './auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token using our auth utility
    const token = getAuthToken();
    const cookie = document.cookie;

    console.log(cookie);

    console.log('Request Token:', token);

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling token refresh or auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear invalid token using our auth utility
      removeAuthToken();

      // Redirect to login if needed
      // You can add additional logic here if needed
    }

    return Promise.reject(error);
  },
);

export default api;
