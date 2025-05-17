import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Folder } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden scale-in-center">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {type === 'create-file' || (type === 'modify' && itemType === 'file') ? (
              <FileText className="text-blue-500" size={22} />
            ) : type === 'create-folder' || itemType === 'folder' ? (
              <Folder className="text-yellow-500" size={22} />
            ) : type === 'delete' ? (
              <X className="text-red-500" size={22} />
            ) : (
              <FileText className="text-gray-500" size={22} />
            )}
            
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 font-heading">
              {titles[type]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {type !== 'delete' && type !== 'modify' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {type === 'rename' ? 'New name' : 'Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                autoFocus
                placeholder={`Enter ${itemType} name...`}
              />
            </div>
          )}

          {type === 'modify' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => onContentChange?.(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                spellCheck={false}
              />
            </div>
          )}

          {type === 'delete' && (
            <div className="mb-5">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                <p className="text-red-800 dark:text-red-300">
                  Are you sure you want to delete this {itemType}? This action cannot be undone.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2.5 rounded-lg text-white transition-colors font-medium flex items-center space-x-2
                ${type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'} shadow-sm`}
            >
              {type === 'modify' && (
                <>
                  <Save size={18} />
                  <span>Save</span>
                </>
              )}
              {type === 'delete' && (
                <>
                  <X size={18} />
                  <span>Delete</span>
                </>
              )}
              {type !== 'modify' && type !== 'delete' && (
                <span>Create</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileDialog;