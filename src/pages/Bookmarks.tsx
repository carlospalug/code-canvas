import React from 'react';
import { Bookmark, Info, ExternalLink } from 'lucide-react';

const Bookmarks: React.FC = () => {
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bookmarks</h1>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center max-w-md p-6 bounce-in">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark size={40} className="text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">No bookmarks yet</h2>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
            Bookmark your favorite files and folders for quick access
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3 text-left border border-blue-100 dark:border-blue-800/40 shadow-sm">
            <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">How to bookmark</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To bookmark a file or folder, right-click on it in the Storage view and select "Add to Bookmarks"
              </p>
            </div>
          </div>
          <button className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium">
            <span>Learn more about bookmarks</span>
            <ExternalLink size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;