import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CodeSnippet } from './types';

interface SnippetsState {
  snippets: CodeSnippet[];
  addSnippet: (snippet: Omit<CodeSnippet, 'id'>) => void;
  updateSnippet: (id: string, snippet: Partial<CodeSnippet>) => void;
  deleteSnippet: (id: string) => void;
  getSnippetsForLanguage: (language: string) => CodeSnippet[];
}

export const useSnippetsStore = create<SnippetsState>()(
  persist(
    (set, get) => ({
      snippets: [
        {
          id: 'react-component',
          name: 'React Component',
          description: 'Create a new React functional component',
          language: 'typescript',
          code: `interface Props {
  // Add props here
}

const Component: React.FC<Props> = () => {
  return (
    <div>
      {/* Add content here */}
    </div>
  );
};

export default Component;`
        },
        {
          id: 'useState-hook',
          name: 'useState Hook',
          description: 'Add React useState hook',
          language: 'typescript',
          code: 'const [state, setState] = useState<type>(initialValue);'
        }
      ],
      addSnippet: (snippet) => set((state) => ({
        snippets: [...state.snippets, { ...snippet, id: crypto.randomUUID() }]
      })),
      updateSnippet: (id, snippet) => set((state) => ({
        snippets: state.snippets.map((s) =>
          s.id === id ? { ...s, ...snippet } : s
        )
      })),
      deleteSnippet: (id) => set((state) => ({
        snippets: state.snippets.filter((s) => s.id !== id)
      })),
      getSnippetsForLanguage: (language) => {
        return get().snippets.filter((s) => s.language === language);
      }
    }),
    {
      name: 'snippets-storage'
    }
  )
);