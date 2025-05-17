import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useSnippetsStore } from '../../store/snippetsStore';
import type { CodeSnippet } from '../../store/types';

interface SnippetsPanelProps {
  onInsert: (code: string) => void;
  language: string;
}

const SnippetsPanel: React.FC<SnippetsPanelProps> = ({ onInsert, language }) => {
  const { snippets, addSnippet, updateSnippet, deleteSnippet } = useSnippetsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Partial<CodeSnippet>>({});

  const handleSave = () => {
    if (editingSnippet.id) {
      updateSnippet(editingSnippet.id, editingSnippet);
    } else {
      addSnippet({
        name: editingSnippet.name || '',
        description: editingSnippet.description || '',
        language: editingSnippet.language || language,
        code: editingSnippet.code || ''
      });
    }
    setIsEditing(false);
    setEditingSnippet({});
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Code Snippets</h3>
        <button
          onClick={() => {
            setEditingSnippet({});
            setIsEditing(true);
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Plus size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {isEditing ? (
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Snippet name"
            value={editingSnippet.name || ''}
            onChange={(e) => setEditingSnippet(s => ({ ...s, name: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
              dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Description"
            value={editingSnippet.description || ''}
            onChange={(e) => setEditingSnippet(s => ({ ...s, description: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
              dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
          />
          <textarea
            placeholder="Code"
            value={editingSnippet.code || ''}
            onChange={(e) => setEditingSnippet(s => ({ ...s, code: e.target.value }))}
            className="w-full h-32 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
              dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 font-mono"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingSnippet({});
              }}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 
                dark:hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {snippets
            .filter(s => s.language === language)
            .map(snippet => (
              <div
                key={snippet.id}
                className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 
                  dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {snippet.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingSnippet(snippet);
                        setIsEditing(true);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2 size={14} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Trash2 size={14} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {snippet.description}
                </p>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono 
                  cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => onInsert(snippet.code)}
                >
                  {snippet.code.length > 100
                    ? snippet.code.slice(0, 100) + '...'
                    : snippet.code}
                </pre>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SnippetsPanel;