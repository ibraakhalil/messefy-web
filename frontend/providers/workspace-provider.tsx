'use client';

import type { WorkspaceMember } from '@/lib/workspace-requests';
import {
  createWorkspaceStore,
  type WorkspaceStore,
  type WorkspaceStoreApi,
} from '@/stores/workspace-store';
import { createContext, type ReactNode, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';

const WorkspaceStoreContext = createContext<WorkspaceStoreApi | null>(null);

export function WorkspaceProvider({
  children,
  member,
}: {
  children: ReactNode;
  member: WorkspaceMember | null;
}) {
  const storeRef = useRef<WorkspaceStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createWorkspaceStore(member);
  }

  useEffect(() => {
    storeRef.current?.getState().setMember(member);
  }, [member]);

  return (
    <WorkspaceStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkspaceStoreContext.Provider>
  );
}

export function useWorkspace<T>(selector: (state: WorkspaceStore) => T): T {
  const store = useContext(WorkspaceStoreContext);

  if (store === null) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return useStore(store, selector);
}
