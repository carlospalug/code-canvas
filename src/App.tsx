import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Bot } from 'lucide-react';
import Editor from './components/Editor';
import StatusBar from './components/StatusBar';
import TabBar from './components/TabBar';
import AiAssistant from './components/AiAssistant';
import Sidebar from './components/Sidebar';
import Storage from './pages/Storage';
import Bookmarks from './pages/Bookmarks';
import RecentFiles from './pages/RecentFiles';
import CodeSamples from './pages/CodeSamples';
import StorageManager from './pages/StorageManager';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Login from './pages/Login';
import { StatusBar as CapacitorStatusBar } from '@capacitor/status-bar';
import { Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { useThemeStore } from './store/themeStore';
import { useTabsStore } from './store/tabsStore';
import { useNavigationStore } from './store/navigationStore';
import { useAuthStore } from './store/authStore';

if (Capacitor.getPlatform() !== 'web') {
  CapacitorStatusBar.setBackgroundColor({ color: '#1f2937' });
}

function App() {
  const { isDark, toggleTheme } = useThemeStore();
  const { tabs, activeTabId, addTab } = useTabsStore();
  const { currentView } = useNavigationStore();
  const { isAuthenticated, user, signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState('fade-in');

  useEffect(() => {
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    const checkPermissions = async () => {
      if (Capacitor.getPlatform() === 'android') {
        try {
          await Filesystem.checkPermissions();
          await Filesystem.requestPermissions();
        } catch (error) {
          console.error('Error requesting permissions:', error);
        }
      }
    };

    checkPermissions();
  }, []);

  // Create a new file on first load if no tabs exist
  useEffect(() => {
    if (tabs.length === 0) {
      addTab({
        name: 'untitled.txt',
        path: '',
        language: 'plaintext',
        content: ''
      });
    }
  }, []);

  // Add page transition effect when view changes
  useEffect(() => {
    setPageTransition('');
    setTimeout(() => {
      setPageTransition('fade-in');
    }, 10);
  }, [currentView]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    if (!currentView) {
      return (
        <div className={`flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden ${pageTransition}`}>
          {tabs.length > 0 && (
            <TabBar 
              files={tabs}
              activeFileId={activeTabId}
              onTabChange={(id) => useTabsStore.getState().setActiveTab(id)}
              onTabClose={(id) => useTabsStore.getState().closeTab(id)}
              isDark={isDark}
            />
          )}
          <div className="flex-1 overflow-hidden">
            <Editor isDark={isDark} />
          </div>
        </div>
      );
    }

    const Component = (() => {
      switch (currentView) {
        case 'storage':
          return Storage;
        case 'bookmarks':
          return Bookmarks;
        case 'recent':
          return RecentFiles;
        case 'samples':
          return CodeSamples;
        case 'manager':
          return StorageManager;
        case 'settings':
          return Settings;
        case 'help':
          return Help;
        default:
          return () => null;
      }
    })();

    return (
      <div className={`flex-1 overflow-hidden ${pageTransition}`}>
        <Component />
      </div>
    );
  };

  return (
    <div className="app-container h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 flex items-center px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white border-b border-gray-700 min-w-0 shadow-md">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 hover:bg-gray-700/50 active:bg-gray-700 rounded-full transition-colors flex-shrink-0
            hover:scale-110 active:scale-95 transition-transform"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} className="text-gray-100" />
        </button>
        <h1 className="ml-4 text-lg font-semibold font-heading text-white truncate">Code Canvas</h1>
        <div className="ml-auto flex items-center space-x-2 flex-shrink-0">
          {user && (
            <div className="flex items-center mr-4 space-x-3">
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-blue-500/20 shadow-sm"
                />
              )}
              <span className="text-sm text-gray-200 truncate max-w-[120px] font-medium">
                {user.name}
              </span>
            </div>
          )}
          <button
            onClick={() => setAiAssistantOpen(true)}
            className="p-3 hover:bg-gray-700/50 active:bg-gray-700 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="AI Assistant"
          >
            <Bot size={24} className="text-gray-100" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-3 hover:bg-gray-700/50 active:bg-gray-700 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={24} className="text-gray-100" /> : <Moon size={24} className="text-gray-100" />}
          </button>
        </div>
      </div>

      <div className="main-layout flex-1 flex relative overflow-hidden">
        {/* Sidebar with improved transition */}
        <div 
          className={`fixed z-50 h-[calc(100%-4rem)] ${sidebarOpen ? 'left-0 shadow-xl' : '-left-full'} 
            transition-all duration-300 ease-in-out w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>

      <StatusBar isDark={isDark} />
      
      <AiAssistant 
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />
    </div>
  );
}

export default App;