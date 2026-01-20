'use client';

import { WorkspaceMember } from '@/lib/workspace-requests';
import React, { createContext, useContext, ReactNode } from 'react';

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
}

interface WorkspaceContextType {
  member: WorkspaceMember | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
  children,
  member,
}: {
  children: ReactNode;
  member: WorkspaceMember | null;
}) {
  return <WorkspaceContext.Provider value={{ member }}>{children}</WorkspaceContext.Provider>;
}

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
