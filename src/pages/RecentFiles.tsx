import React from 'react';
import { Clock } from 'lucide-react';

const RecentFiles: React.FC = () => {
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Files</h1>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p>No recent files</p>
        </div>
      </div>
    </div>
  );
};

export default RecentFiles;