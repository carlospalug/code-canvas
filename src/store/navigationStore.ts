import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type View = 'storage' | 'bookmarks' | 'recent' | 'samples' | 'manager' | 'settings' | 'help' | 'exit' | null;

interface NavigationState {
  currentView: View;
  previousView: View | null;
  setCurrentView: (view: View) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      currentView: null,
      previousView: null,
      setCurrentView: (view) => 
        set((state) => ({ 
          currentView: view,
          previousView: state.currentView 
        })),
    }),
    {
      name: 'navigation-storage',
    }
  )
);