import React from 'react';
import { Bookmark } from 'lucide-react';

const Bookmarks: React.FC = () => {
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bookmarks</h1>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
          <p>No bookmarks yet</p>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;