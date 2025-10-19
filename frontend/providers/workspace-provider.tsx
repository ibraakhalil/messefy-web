'use client';

import { WorkspaceMember } from '@/lib/workspace-requests';
import React, { createContext, useContext, ReactNode } from 'react';

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
}

interface WorkspaceMemberContextType {
  member: WorkspaceMember | null;
}

const WorkspaceMemberContext = createContext<WorkspaceMemberContextType | undefined>(undefined);

export function WorkspaceMemberProvider({
  children,
  member,
}: {
  children: ReactNode;
  member: WorkspaceMember | null;
}) {
  return (
    <WorkspaceMemberContext.Provider value={{ member }}>{children}</WorkspaceMemberContext.Provider>
  );
}

export const useWorkspaceMember = (): WorkspaceMemberContextType => {
  const context = useContext(WorkspaceMemberContext);
  if (!context) {
    throw new Error('useWorkspaceMember must be used within a WorkspaceMemberProvider');
  }
  return context;
};
