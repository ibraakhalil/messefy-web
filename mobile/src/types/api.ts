export interface ApiResponse<T = unknown> {
  status?: 'success' | 'error';
  message?: string;
  data?: T;
  error?: string;
  code?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified?: string | null;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
}
