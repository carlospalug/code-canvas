import React from 'react';
import { HardDrive, Trash2 } from 'lucide-react';

const StorageManager: React.FC = () => {
  return (
    <div className="h-full p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Storage Usage</h3>
          <HardDrive size={20} className="text-gray-500" />
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-blue-500" />
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          2.1 GB free of 6 GB
        </div>
      </div>

      <button className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 
        text-white rounded-lg hover:bg-red-700 transition-colors">
        <Trash2 size={18} />
        <span>Clear Cache</span>
      </button>
    </div>
  );
};

export default StorageManager;