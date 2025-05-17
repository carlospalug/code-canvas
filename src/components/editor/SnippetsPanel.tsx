import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredSnippets = snippets
    .filter(s => s.language === language)
    .filter(s => 
      searchTerm === '' || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Code Snippets</h3>
        <button
          onClick={() => {
            setEditingSnippet({});
            setIsEditing(true);
          }}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          <Plus size={16} className="text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      {!isEditing && (
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 
                rounded-md border border-slate-200 dark:border-slate-600
                text-slate-900 dark:text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              placeholder="Snippet name"
              value={editingSnippet.name || ''}
              onChange={(e) => setEditingSnippet(s => ({ ...s, name: e.target.value }))}
              className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 
                dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="Short description"
              value={editingSnippet.description || ''}
              onChange={(e) => setEditingSnippet(s => ({ ...s, description: e.target.value }))}
              className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 
                dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Code
            </label>
            <textarea
              placeholder="Enter your code snippet here"
              value={editingSnippet.code || ''}
              onChange={(e) => setEditingSnippet(s => ({ ...s, code: e.target.value }))}
              className="w-full h-32 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 
                dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 font-mono text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingSnippet({});
              }}
              className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 
                dark:hover:bg-slate-700 rounded-md transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredSnippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-slate-500 dark:text-slate-400 text-center">
              <Code size={32} className="mb-2 opacity-50" />
              {searchTerm ? (
                <p className="text-sm">No matching snippets found</p>
              ) : (
                <p className="text-sm">No snippets available for this language. Create a new one!</p>
              )}
            </div>
          ) : (
            filteredSnippets.map(snippet => (
              <div
                key={snippet.id}
                className="p-3 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 
                  dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {snippet.name}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setEditingSnippet(snippet);
                        setIsEditing(true);
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md"
                      title="Edit snippet"
                    >
                      <Edit2 size={14} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md"
                      title="Delete snippet"
                    >
                      <Trash2 size={14} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {snippet.description}
                </p>
                <div 
                  className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md font-mono 
                    cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors
                    border border-slate-200 dark:border-slate-700 relative group"
                  onClick={() => onInsert(snippet.code)}
                >
                  <div className="overflow-hidden" style={{ maxHeight: '80px' }}>
                    {snippet.code.length > 100
                      ? snippet.code.slice(0, 100) + '...'
                      : snippet.code}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100 dark:to-slate-800 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow-sm">Click to Insert</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SnippetsPanel;