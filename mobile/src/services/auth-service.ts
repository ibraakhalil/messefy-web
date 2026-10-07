import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import type { UserProfile, AuthSession } from '@/types/api';

// Validation Schemas
export const loginSchema = z.object({
  email: z.string().trim().email('সঠিক ইমেইল ঠিকানা দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'আপনার নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
  email: z.string().trim().email('সঠিক ইমেইল ঠিকানা দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const authService = {
  // Sign In
  async login(input: LoginInput): Promise<AuthSession> {
    const validated = loginSchema.parse(input);
    const response = await apiClient.post<{
      id: string;
      email: string;
      name: string;
      image?: string | null;
      emailVerified?: string | null;
      token: string;
    }>('/auth/signin', validated);

    const { token, ...user } = response.data;
    return { user, token };
  },

  // Sign Up
  async register(input: RegisterInput): Promise<AuthSession> {
    const validated = registerSchema.parse(input);
    await apiClient.post('/auth/signup', validated);

    // Auto sign-in after successful registration
    return this.login({
      email: validated.email,
      password: validated.password,
    });
  },

  // Fetch Current Logged-in User
  async getCurrentUser(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  },
};
