import React from 'react';
import { Bookmark, Info, ExternalLink } from 'lucide-react';

const Bookmarks: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <div className="text-center max-w-sm p-6 bounce-in">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <Bookmark size={32} className="text-blue-500 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No bookmarks yet</h2>
        <p className="text-sm mb-5 text-gray-600 dark:text-gray-400">
          Save your favorite files and folders for quick access
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-start space-x-3 text-left border border-blue-100 dark:border-blue-800/40">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Tip</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Long-press on any file or folder to add it to your bookmarks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;