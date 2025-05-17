import React from 'react';
import { Clock } from 'lucide-react';

const RecentFiles: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <Clock size={48} className="mb-4 opacity-50" />
      <p>No recent files</p>
    </div>
  );
};

export default RecentFiles;