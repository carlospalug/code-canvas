import React from 'react';
import FileExplorer from '../components/FileExplorer';
import FileDialog from '../components/dialogs/FileDialog';
import { useFileDialogStore } from '../store/fileDialogStore';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const Storage: React.FC = () => {
  const { dialogType, isOpen, closeDialog } = useFileDialogStore();

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
    <div className="h-screen bg-white dark:bg-gray-900">
      <FileExplorer />
      
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