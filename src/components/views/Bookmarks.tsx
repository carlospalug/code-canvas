import React from 'react';
import { Bookmark } from 'lucide-react';

const Bookmarks: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <Bookmark size={48} className="mb-4 opacity-50" />
      <p>No bookmarks yet</p>
    </div>
  );
};

export default Bookmarks;