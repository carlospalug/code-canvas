import { create } from 'zustand';

interface GitFile {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
}

interface GitState {
  branch: string;
  files: GitFile[];
  isLoading: boolean;
  error: string | null;
  setBranch: (branch: string) => void;
  setFiles: (files: GitFile[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGitStore = create<GitState>((set) => ({
  branch: 'main',
  files: [],
  isLoading: false,
  error: null,
  setBranch: (branch) => set({ branch }),
  setFiles: (files) => set({ files }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));