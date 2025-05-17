import React from 'react';
import { Clock, FileText, ExternalLink } from 'lucide-react';

const RecentFiles: React.FC = () => {
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Files</h1>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center max-w-md p-6 bounce-in">
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-indigo-500 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">No recent files</h2>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
            Files you've recently opened will appear here
          </p>
          <div className="flex flex-col gap-3 mx-auto max-w-xs">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center opacity-75 slide-in-up" style={{ animationDelay: '0.1s' }}>
              <FileText size={20} className="mr-3 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">example.js</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center opacity-75 slide-in-up" style={{ animationDelay: '0.2s' }}>
              <FileText size={20} className="mr-3 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">project.html</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center opacity-75 slide-in-up" style={{ animationDelay: '0.3s' }}>
              <FileText size={20} className="mr-3 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">style.css</span>
            </div>
          </div>
          <button className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            <span>Open file browser</span>
            <ExternalLink size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentFiles;