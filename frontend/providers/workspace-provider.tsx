'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
  children,
  workspace,
}: {
  children: ReactNode;
  workspace: Workspace | null;
}) {
  return <WorkspaceContext.Provider value={{ workspace }}>{children}</WorkspaceContext.Provider>;
}

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
