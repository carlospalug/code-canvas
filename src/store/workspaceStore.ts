import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkspaceState } from './types';

interface WorkspacesState {
  workspaces: WorkspaceState[];
  currentWorkspace: string | null;
  addWorkspace: (workspace: Omit<WorkspaceState, 'id'>) => string;
  updateWorkspace: (id: string, workspace: Partial<WorkspaceState>) => void;
  deleteWorkspace: (id: string) => void;
  setCurrentWorkspace: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspacesState>()(
  persist(
    (set) => ({
      workspaces: [],
      currentWorkspace: null,
      addWorkspace: (workspace) => {
        const id = crypto.randomUUID();
        set((state) => ({
          workspaces: [...state.workspaces, { ...workspace, id }],
          currentWorkspace: id
        }));
        return id;
      },
      updateWorkspace: (id, workspace) => set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w.id === id ? { ...w, ...workspace } : w
        )
      })),
      deleteWorkspace: (id) => set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== id),
        currentWorkspace: state.currentWorkspace === id ? null : state.currentWorkspace
      })),
      setCurrentWorkspace: (id) => set({ currentWorkspace: id })
    }),
    {
      name: 'workspaces-storage'
    }
  )
);