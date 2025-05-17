import React from 'react';
import { HelpCircle, ExternalLink, BookOpen, Coffee, Star, MessageSquare } from 'lucide-react';

const Help: React.FC = () => {
  const helpItems = [
    { 
      title: 'Getting Started', 
      description: 'Learn the basics of using Code Editor',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      delay: '0.1s'
    },
    { 
      title: 'File Management', 
      description: 'How to create, edit, and organize your files',
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      delay: '0.2s'
    },
    { 
      title: 'Keyboard Shortcuts', 
      description: 'Boost your productivity with shortcuts',
      icon: Coffee,
      color: 'text-red-500', 
      bg: 'bg-red-50 dark:bg-red-900/20',
      delay: '0.3s'
    },
    { 
      title: 'Settings & Customization', 
      description: 'Personalize your editing experience',
      icon: MessageSquare,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      delay: '0.4s'
    },
  ];

  return (
    <div className="h-full p-4">
      <div className="mb-6 fade-in">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Help Center
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find answers to common questions and learn how to use Code Editor effectively.
        </p>
      </div>

      <div className="space-y-4">
        {helpItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-start p-4 rounded-lg text-left slide-in-right transform transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              animationDelay: item.delay,
              backgroundColor: `var(--${item.bg.split('-')[1]})`
            }}
          >
            <div className={`${item.bg} p-3 rounded-lg ${item.color} mr-4 flex-shrink-0`}>
              <item.icon size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
            <ExternalLink size={18} className="text-gray-400 mt-1 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Help;