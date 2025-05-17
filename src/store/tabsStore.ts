import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FileTab } from './types';

interface TabsState {
  tabs: FileTab[];
  activeTabId: string | null;
  addTab: (tab: Omit<FileTab, 'id'>) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string, language?: string) => void;
  markTabDirty: (id: string, isDirty: boolean) => void;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,
      addTab: (tab) => {
        const id = crypto.randomUUID();
        set((state) => ({
          tabs: [...state.tabs, { ...tab, id, isDirty: false }],
          activeTabId: id,
        }));
        return id;
      },
      closeTab: (id) => {
        set((state) => {
          const newTabs = state.tabs.filter((tab) => tab.id !== id);
          const wasActive = state.activeTabId === id;
          return {
            tabs: newTabs,
            activeTabId: wasActive ? newTabs[0]?.id ?? null : state.activeTabId,
          };
        });
      },
      setActiveTab: (id) => set({ activeTabId: id }),
      updateTabContent: (id, content, language) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id 
              ? { ...tab, content, ...(language ? { language } : {}) }
              : tab
          ),
        }));
      },
      markTabDirty: (id, isDirty) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, isDirty } : tab
          ),
        }));
      },
    }),
    {
      name: 'tabs-storage',
      partialize: (state) => ({
        tabs: state.tabs.map(({ id, name, path, language }) => ({
          id,
          name,
          path,
          language,
        })),
      }),
    }
  )
);