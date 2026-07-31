import type { WorkspaceMember } from '@/lib/workspace-requests';
import { createStore } from 'zustand/vanilla';

export interface WorkspaceState {
  member: WorkspaceMember | null;
}

export interface WorkspaceActions {
  setMember: (member: WorkspaceMember | null) => void;
  clearWorkspace: () => void;
}

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const createWorkspaceStore = (initialMember: WorkspaceMember | null) =>
  createStore<WorkspaceStore>()((set) => ({
    member: initialMember,
    setMember: (member) => set({ member }),
    clearWorkspace: () => set({ member: null }),
  }));

export type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>;
