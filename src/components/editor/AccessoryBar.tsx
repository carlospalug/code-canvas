import React, { useState } from 'react';
import { Code } from 'lucide-react';
import SnippetsPanel from './SnippetsPanel';

interface AccessoryBarProps {
  editor: any;
  language: string;
}

const AccessoryBar: React.FC<AccessoryBarProps> = ({ editor, language }) => {
  const [showSnippets, setShowSnippets] = useState(false);
  
  const symbols = [
    { label: '{', value: '{' },
    { label: '}', value: '}' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '<', value: '<' },
    { label: '>', value: '>' },
    { label: ';', value: ';' },
    { label: '=', value: '=' },
    { label: '!', value: '!' },
    { label: '→', value: '=>' },
    { label: '`', value: '`' },
    { label: '${}', value: '${|}' },
  ];

  const insertSymbol = (value: string) => {
    const selection = editor.getSelection();
    const cursorPosition = selection.getPosition();
    
    if (value === '${|}') {
      editor.executeEdits('', [
        {
          range: selection,
          text: '${}',
          forceMoveMarkers: true
        }
      ]);
      editor.setPosition({
        lineNumber: cursorPosition.lineNumber,
        column: cursorPosition.column + 2
      });
    } else {
      editor.executeEdits('', [
        {
          range: selection,
          text: value,
          forceMoveMarkers: true
        }
      ]);
    }
    editor.focus();
  };

  const insertSnippet = (code: string) => {
    const selection = editor.getSelection();
    editor.executeEdits('', [
      {
        range: selection,
        text: code,
        forceMoveMarkers: true
      }
    ]);
    editor.focus();
    setShowSnippets(false);
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 
        border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex items-center px-2 py-1 space-x-1">
          <button
            onClick={() => setShowSnippets(!showSnippets)}
            className={`min-w-[36px] h-9 flex items-center justify-center px-2 rounded 
              ${showSnippets 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'} 
              hover:bg-gray-50 dark:hover:bg-gray-600 
              border border-gray-200 dark:border-gray-600
              transition-colors`}
          >
            <Code size={16} />
          </button>
          {symbols.map((symbol) => (
            <button
              key={symbol.value}
              onClick={() => insertSymbol(symbol.value)}
              className="min-w-[36px] h-9 flex items-center justify-center px-2 rounded 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200
                hover:bg-gray-50 dark:hover:bg-gray-600 
                active:bg-gray-100 dark:active:bg-gray-500
                border border-gray-200 dark:border-gray-600
                transition-colors"
            >
              {symbol.label}
            </button>
          ))}
        </div>
      </div>
      
      {showSnippets && (
        <div className="absolute bottom-[52px] left-0 right-0 h-64 bg-white dark:bg-gray-800 
          border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <SnippetsPanel onInsert={insertSnippet} language={language} />
        </div>
      )}
    </>
  );
};

export default AccessoryBar;