export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface Member {
  id: string;
  userId: string | null;
  workspaceId: string;
  name: string | null;
  role: string;
  isOffline: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: User | null;
}
