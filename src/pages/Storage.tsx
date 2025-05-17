import React, { useState } from 'react';
import FileExplorer from '../components/FileExplorer';
import FileDialog from '../components/dialogs/FileDialog';
import { useFileDialogStore } from '../store/fileDialogStore';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FilePlus, FolderPlus, Search } from 'lucide-react';

const Storage: React.FC = () => {
  const { dialogType, isOpen, closeDialog, openDialog } = useFileDialogStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateItem = async (name: string) => {
    try {
      if (dialogType === 'create-file') {
        await Filesystem.writeFile({
          path: name,
          data: '',
          directory: Directory.ExternalStorage,
          encoding: Encoding.UTF8,
        });
      } else if (dialogType === 'create-folder') {
        await Filesystem.mkdir({
          path: name,
          directory: Directory.ExternalStorage,
          recursive: true,
        });
      }
      closeDialog();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header with search and actions */}
      <div className="p-3 flex gap-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 rounded-lg
              text-gray-900 dark:text-gray-100 placeholder-gray-500"
          />
        </div>
        
        <button 
          onClick={() => openDialog('create-file')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FilePlus size={16} />
          <span className="hidden sm:inline">New File</span>
        </button>
        
        <button 
          onClick={() => openDialog('create-folder')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FolderPlus size={16} />
          <span className="hidden sm:inline">New Folder</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <FileExplorer />
      </div>
      
      <FileDialog
        type={dialogType || 'create-file'}
        isOpen={isOpen}
        onClose={closeDialog}
        onConfirm={handleCreateItem}
        itemType={dialogType === 'create-file' ? 'file' : 'folder'}
      />
    </div>
  );
};

export default Storage;