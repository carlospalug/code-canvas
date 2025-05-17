import React, { useState } from 'react';
import { File, GitBranch, Settings, Search } from 'lucide-react';

interface ActivityBarProps {
  activeTab: 'files' | 'git' | 'settings' | 'search';
  onTabChange: (tab: 'files' | 'git' | 'settings' | 'search') => void;
  isDark: boolean;
}



const ActivityBar: React.FC<ActivityBarProps> = ({ activeTab, onTabChange, isDark }) => {
  const tabs = [
    { id: 'files', icon: File, label: 'File Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  const [isTapped, setIsTapped] = useState<string | null>(null)

  return (
    <div className={`w-16 flex flex-col items-center py-4 gap-6
      ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}
    >
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`p-4 rounded-xl transition-colors relative group ${
            activeTab === id
              ? isDark
                ? 'bg-gray-800'
                : 'bg-gray-200'
              : isDark
              ? 'hover:bg-gray-800'
              : 'hover:bg-gray-200'
          } ${isTapped === id ? (isDark ? 'bg-gray-700' : 'bg-gray-300') : ''}`}
          aria-label={label}
          onTouchStart={() => setIsTapped(id)}
          onTouchEnd={() => setIsTapped(null)}
          onMouseDown={() => setIsTapped(id)}
          onMouseUp={() => setIsTapped(null)}
        >
          <Icon 
            size={24} 
            className={activeTab === id 
              ? (isDark ? 'text-gray-200' : 'text-gray-900')
              : (isDark ? 'text-gray-500' : 'text-gray-600')} 
          />
          <div className={`absolute left-16 top-1/2 -translate-y-1/2 py-2 px-3 rounded-lg opacity-0 invisible 
            group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50
            ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-900'}`}>
            {label}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ActivityBar;