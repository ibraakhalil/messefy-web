export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export interface Member extends User {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}
