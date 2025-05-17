import React from 'react';
import { X } from 'lucide-react';
import FileIcon from './FileIcon';

interface TabBarProps {
  files: Array<{
    id: string;
    name: string;
    language: string;
  }>;
  activeFileId: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
  isDark: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ files, activeFileId, onTabChange, onTabClose, isDark }) => {
  return (
    <div className="h-12 border-b border-gray-200 dark:border-gray-700 flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 bg-gray-50 dark:bg-gray-900">
      {files.map(file => (
        <div
          key={file.id}
          className={`h-full flex items-center px-4 min-w-[140px] max-w-[180px] cursor-pointer group relative border-r border-gray-200 dark:border-gray-700
            ${activeFileId === file.id 
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200' 
              : 'text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => onTabChange(file.id)}
        >
          <span className="mr-2">
            <FileIcon filename={file.name} size={16} />
          </span>
          <span className="truncate flex-1 text-sm">{file.name}</span>
          <button
            className={`p-1.5 rounded opacity-0 group-hover:opacity-100 
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-opacity
              ${activeFileId === file.id ? 'opacity-100' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(file.id);
            }}
          >
            <X size={14} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200" />
          </button>
          {activeFileId === file.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TabBar;