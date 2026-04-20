import api from '@/utils/axios';

export interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getCurrentUser() {
  const { data } = await api.get<ProfileUser>('/users/me');
  return data;
}

export async function updateCurrentUser(payload: { name: string }) {
  const { data } = await api.patch<ProfileUser>('/users/me', payload);
  return data;
}
