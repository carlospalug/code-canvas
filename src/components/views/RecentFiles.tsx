import React from 'react';
import { Clock, FileText, ExternalLink } from 'lucide-react';

const RecentFiles: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <div className="text-center max-w-md p-6 bounce-in">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <Clock size={32} className="text-indigo-500 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No recent files</h2>
        <p className="mb-5 text-gray-600 dark:text-gray-400">
          Files you've recently opened will appear here for quick access
        </p>
        <div className="flex flex-col gap-2 mx-auto max-w-xs">
          <div className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-lg flex items-center opacity-75 slide-in-up" style={{ animationDelay: '0.1s' }}>
            <FileText size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">example.js</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-lg flex items-center opacity-75 slide-in-up" style={{ animationDelay: '0.2s' }}>
            <FileText size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">project.html</span>
          </div>
        </div>
        <button className="mt-5 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
          <span>Browse files</span>
          <ExternalLink size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default RecentFiles;