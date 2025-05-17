import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface FileDialogProps {
  type: 'create-file' | 'create-folder' | 'rename' | 'delete' | 'modify';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  initialName?: string;
  itemType?: 'file' | 'folder';
  content?: string;
  onContentChange?: (content: string) => void;
  onSave?: () => void;
}

const FileDialog: React.FC<FileDialogProps> = ({
  type,
  isOpen,
  onClose,
  onConfirm,
  initialName = '',
  itemType = 'file',
  content = '',
  onContentChange,
  onSave
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  if (!isOpen) return null;

  const titles = {
    'create-file': 'Create New File',
    'create-folder': 'Create New Folder',
    'rename': 'Rename',
    'delete': 'Confirm Delete',
    'modify': 'Modify File'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'modify' && onSave) {
      onSave();
    } else {
      onConfirm(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {titles[type]}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {type !== 'delete' && type !== 'modify' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {type === 'rename' ? 'New name' : 'Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}

          {type === 'modify' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => onContentChange?.(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck={false}
              />
            </div>
          )}

          {type === 'delete' && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this {itemType}? This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white transition-colors flex items-center gap-2
                ${type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {type === 'modify' && <Save size={16} />}
              {type === 'delete' ? 'Delete' : type === 'modify' ? 'Save' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileDialog;