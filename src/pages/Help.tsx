import React from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';

const Help: React.FC = () => {
  const helpItems = [
    { title: 'Getting Started', description: 'Learn the basics of using Code Editor' },
    { title: 'File Management', description: 'How to create, edit, and organize your files' },
    { title: 'Keyboard Shortcuts', description: 'Boost your productivity with shortcuts' },
    { title: 'Settings & Customization', description: 'Personalize your editing experience' },
  ];

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Help Center</h1>
      </div>
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {helpItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-start p-4 bg-gray-100 dark:bg-gray-800 rounded-lg
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
              <ExternalLink size={18} className="text-gray-400 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;