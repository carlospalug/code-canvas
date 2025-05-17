import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorPosition, EditorSelection, GitConfig } from './types';

interface EditorState {
  // Editor settings
  fontSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  minimap: boolean;
  whitespace: boolean;
  indentGuides: boolean;
  tabSize: number;
  insertSpaces: boolean;
  autoClosingBrackets: boolean;
  formatOnPaste: boolean;
  formatOnType: boolean;
  gitConfig: GitConfig;

  // Editor state
  position: EditorPosition;
  selection: EditorSelection | null;
  
  // Actions
  setFontSize: (size: number) => void;
  toggleLineNumbers: () => void;
  toggleWordWrap: () => void;
  toggleMinimap: () => void;
  toggleWhitespace: () => void;
  toggleIndentGuides: () => void;
  setTabSize: (size: number) => void;
  toggleInsertSpaces: () => void;
  toggleAutoClosingBrackets: () => void;
  toggleFormatOnPaste: () => void;
  toggleFormatOnType: () => void;
  updateGitConfig: (config: Partial<GitConfig>) => void;
  setPosition: (position: EditorPosition) => void;
  setSelection: (selection: EditorSelection | null) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      // Editor settings
      fontSize: 16,
      lineNumbers: true,
      wordWrap: true,
      minimap: false,
      whitespace: false,
      indentGuides: true,
      tabSize: 2,
      insertSpaces: true,
      autoClosingBrackets: true,
      formatOnPaste: true,
      formatOnType: true,
      gitConfig: {
        name: '',
        email: ''
      },

      // Editor state
      position: { lineNumber: 1, column: 1 },
      selection: null,

      // Actions
      setFontSize: (size) => set({ fontSize: size }),
      toggleLineNumbers: () => set((state) => ({ lineNumbers: !state.lineNumbers })),
      toggleWordWrap: () => set((state) => ({ wordWrap: !state.wordWrap })),
      toggleMinimap: () => set((state) => ({ minimap: !state.minimap })),
      toggleWhitespace: () => set((state) => ({ whitespace: !state.whitespace })),
      toggleIndentGuides: () => set((state) => ({ indentGuides: !state.indentGuides })),
      setTabSize: (size) => set({ tabSize: size }),
      toggleInsertSpaces: () => set((state) => ({ insertSpaces: !state.insertSpaces })),
      toggleAutoClosingBrackets: () => set((state) => ({ autoClosingBrackets: !state.autoClosingBrackets })),
      toggleFormatOnPaste: () => set((state) => ({ formatOnPaste: !state.formatOnPaste })),
      toggleFormatOnType: () => set((state) => ({ formatOnType: !state.formatOnType })),
      updateGitConfig: (config) => set((state) => ({
        gitConfig: { ...state.gitConfig, ...config }
      })),
      setPosition: (position) => set({ position }),
      setSelection: (selection) => set({ selection }),
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        fontSize: state.fontSize,
        lineNumbers: state.lineNumbers,
        wordWrap: state.wordWrap,
        minimap: state.minimap,
        whitespace: state.whitespace,
        indentGuides: state.indentGuides,
        tabSize: state.tabSize,
        insertSpaces: state.insertSpaces,
        autoClosingBrackets: state.autoClosingBrackets,
        formatOnPaste: state.formatOnPaste,
        formatOnType: state.formatOnType,
        gitConfig: state.gitConfig,
      }),
    }
  )
);