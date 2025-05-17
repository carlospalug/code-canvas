import { create } from 'zustand';

interface SearchResult {
  path: string;
  line: number;
  content: string;
  matches: { start: number; end: number }[];
}

interface SearchState {
  query: string;
  isSearching: boolean;
  results: SearchResult[];
  setQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setResults: (results: SearchResult[]) => void;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  isSearching: false,
  results: [],
  setQuery: (query) => set({ query }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: [] }),
}));