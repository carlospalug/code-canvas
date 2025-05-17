import { create } from 'zustand';

type DialogType = 'create-file' | 'create-folder' | 'rename' | 'delete' | 'modify' | null;

interface FileDialogState {
  dialogType: DialogType;
  isOpen: boolean;
  openDialog: (type: DialogType) => void;
  closeDialog: () => void;
}

export const useFileDialogStore = create<FileDialogState>((set) => ({
  dialogType: null,
  isOpen: false,
  openDialog: (type) => set({ dialogType: type, isOpen: true }),
  closeDialog: () => set({ dialogType: null, isOpen: false }),
}));