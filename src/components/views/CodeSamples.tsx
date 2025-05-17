import React from 'react';
import { Code, BookOpen, FilePlus, ArrowRight } from 'lucide-react';

const CodeSamples: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <div className="text-center max-w-md p-6 bounce-in">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-5 pulse-subtle">
          <Code size={32} className="text-emerald-500 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Code Samples Library</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Access ready-to-use code snippets and examples to accelerate your development
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg p-4 text-left slide-in-up" style={{ animationDelay: '0.1s' }}>
            <BookOpen size={18} className="mb-2 text-emerald-500" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Browse Library</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Explore samples by language or category</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg p-4 text-left slide-in-up" style={{ animationDelay: '0.2s' }}>
            <FilePlus size={18} className="mb-2 text-emerald-500" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Save Snippets</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create your own reusable code samples</p>
          </div>
        </div>

        <button className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
          <span>Explore samples</span>
          <ArrowRight size={16} className="ml-1.5" />
        </button>
      </div>
    </div>
  );
};

export default CodeSamples;