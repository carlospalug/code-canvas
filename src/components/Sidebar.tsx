import React from 'react';
import { 
  HardDrive,
  Bookmark, 
  Clock, 
  Code2, 
  Database,
  Settings,
  HelpCircle,
  LogOut,
  FilePlus,
  FolderPlus
} from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore';
import { useFileDialogStore } from '../store/fileDialogStore';
import { useAuthStore } from '../store/authStore';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { currentView, setCurrentView } = useNavigationStore();
  const { openDialog } = useFileDialogStore();
  const { signOut } = useAuthStore();

  const menuItems = [
    { id: 'storage', icon: HardDrive, label: 'Storage', view: 'storage' },
    { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks', view: 'bookmarks' },
    { id: 'recent', icon: Clock, label: 'Recent Files', view: 'recent' },
    { id: 'samples', icon: Code2, label: 'Code Samples', view: 'samples' },
    { id: 'manager', icon: Database, label: 'Storage Manager', view: 'manager', divider: true },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
    { id: 'help', icon: HelpCircle, label: 'Help', view: 'help' },
  ] as const;

  const handleNavigation = (view: string) => {
    setCurrentView(view as any);
    onClose();
  };

  const handleCreate = (type: 'file' | 'folder') => {
    setCurrentView('storage');
    onClose();
    openDialog(type === 'file' ? 'create-file' : 'create-folder');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header with enhanced gradient */}
      <div className="p-6 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">
        <h1 className="text-2xl font-bold font-heading text-white">Code Canvas</h1>
        <p className="text-sm font-medium text-blue-100 mt-1">Mobile Code Editor</p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => handleCreate('file')}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 
              bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors shadow-sm"
          >
            <FilePlus size={18} />
            <span className="text-sm font-medium">New File</span>
          </button>
          <button
            onClick={() => handleCreate('folder')}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 
              bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors shadow-sm"
          >
            <FolderPlus size={18} />
            <span className="text-sm font-medium">New Folder</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            <button
              onClick={() => handleNavigation(item.view)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-all duration-200 mb-1
                ${currentView === item.view
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <item.icon 
                size={20} 
                className={`${currentView === item.view
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
                } transition-colors`} 
                strokeWidth={currentView === item.view ? 2.5 : 2}
              />
              <span className="text-sm font-medium">{item.label}</span>
              
              {/* Active indicator */}
              {currentView === item.view && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              )}
            </button>
            {item.divider && (
              <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Connected to Device</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;