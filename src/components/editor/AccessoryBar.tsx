import React, { useState } from 'react';
import { Code, Bold, Italic, AlignLeft, FileCode, RefreshCw, Braces, Hash, List, ListOrdered } from 'lucide-react';
import SnippetsPanel from './SnippetsPanel';

interface AccessoryBarProps {
  editor: any;
  language: string;
}

const AccessoryBar: React.FC<AccessoryBarProps> = ({ editor, language }) => {
  const [showSnippets, setShowSnippets] = useState(false);
  const [activeGroup, setActiveGroup] = useState<'general' | 'coding' | 'formatting'>('general');
  
  // Symbol groups organized by category
  const symbolGroups = {
    general: [
      { label: '{', value: '{', icon: Braces },
      { label: '}', value: '}', icon: Braces },
      { label: '(', value: '(', icon: null },
      { label: ')', value: ')', icon: null },
      { label: '[', value: '[', icon: null },
      { label: ']', value: ']', icon: null },
      { label: ':', value: ':', icon: null },
      { label: ';', value: ';', icon: null },
      { label: ',', value: ',', icon: null },
      { label: '.', value: '.', icon: null },
    ],
    coding: [
      { label: '=', value: '=', icon: null },
      { label: '+', value: '+', icon: null },
      { label: '-', value: '-', icon: null },
      { label: '*', value: '*', icon: null },
      { label: '/', value: '/', icon: null },
      { label: '%', value: '%', icon: null },
      { label: '<', value: '<', icon: null },
      { label: '>', value: '>', icon: null },
      { label: '!', value: '!', icon: null },
      { label: '→', value: '=>', icon: null },
    ],
    formatting: [
      { label: "'", value: "'", icon: null },
      { label: '"', value: '"', icon: null },
      { label: '`', value: '`', icon: null },
      { label: '${}', value: '${|}', icon: null },
      { label: '&', value: '&', icon: null },
      { label: '|', value: '|', icon: null },
      { label: '^', value: '^', icon: null },
      { label: '~', value: '~', icon: null },
      { label: '$', value: '$', icon: null },
      { label: '_', value: '_', icon: null },
    ]
  };

  // Select which symbol group to display
  const activeSymbols = symbolGroups[activeGroup];

  // Format buttons based on language
  const getFormatButtons = () => {
    if (['markdown', 'plaintext'].includes(language)) {
      return [
        { icon: Bold, action: () => insertSymbol('**|**'), tooltip: 'Bold' },
        { icon: Italic, action: () => insertSymbol('*|*'), tooltip: 'Italic' }, 
        { icon: List, action: () => insertSymbol('- '), tooltip: 'Bullet List' },
        { icon: ListOrdered, action: () => insertSymbol('1. '), tooltip: 'Numbered List' },
        { icon: Hash, action: () => insertSymbol('# '), tooltip: 'Heading' }
      ];
    } 
    
    if (['javascript', 'typescript', 'jsx', 'tsx'].includes(language)) {
      return [
        { icon: RefreshCw, action: () => insertSymbol('() => {}'), tooltip: 'Arrow Function' },
        { icon: FileCode, action: () => insertSymbol('import {} from ""'), tooltip: 'Import Statement' }
      ];
    }
    
    return [];
  };

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
      const pipeSplit = value.split('|');
      if (pipeSplit.length > 1) {
        // Handle values with cursor position marker
        const selectedText = editor.getModel().getValueInRange(selection);
        const newText = pipeSplit[0] + selectedText + pipeSplit[1];
        editor.executeEdits('', [
          {
            range: selection,
            text: newText,
            forceMoveMarkers: true
          }
        ]);
        // Position cursor appropriately
        if (selectedText.length === 0) {
          editor.setPosition({
            lineNumber: cursorPosition.lineNumber,
            column: cursorPosition.column + pipeSplit[0].length
          });
        }
      } else {
        editor.executeEdits('', [
          {
            range: selection,
            text: value,
            forceMoveMarkers: true
          }
        ]);
      }
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

  const formatButtons = getFormatButtons();

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-slate-100 dark:bg-slate-800 
        border-t border-slate-200 dark:border-slate-700 overflow-x-auto shadow-inner-top backdrop-blur-sm">
        {/* Category tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveGroup('general')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeGroup === 'general' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveGroup('coding')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeGroup === 'coding' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Coding
          </button>
          <button
            onClick={() => setActiveGroup('formatting')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeGroup === 'formatting' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Formatting
          </button>
        </div>

        {/* Symbols and buttons */}
        <div className="flex items-center p-2 gap-1 overflow-x-auto">
          {/* Snippets button always first */}
          <button
            onClick={() => setShowSnippets(!showSnippets)}
            className={`h-10 flex items-center justify-center px-3 rounded-md 
              ${showSnippets 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200'} 
              hover:bg-slate-50 dark:hover:bg-slate-600 
              border border-slate-200 dark:border-slate-600
              shadow-sm transition-colors`}
            title="Code Snippets"
          >
            <Code size={18} />
          </button>

          {/* Separator */}
          <div className="h-8 border-r border-slate-200 dark:border-slate-700 mx-1"></div>
          
          {/* Format buttons specific to language */}
          {formatButtons.length > 0 && (
            <>
              {formatButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.action}
                  className="h-10 flex items-center justify-center px-3 rounded-md 
                    bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200
                    hover:bg-slate-50 dark:hover:bg-slate-600 
                    border border-slate-200 dark:border-slate-600
                    shadow-sm transition-colors"
                  title={btn.tooltip}
                >
                  <btn.icon size={18} />
                </button>
              ))}
              
              {/* Separator */}
              <div className="h-8 border-r border-slate-200 dark:border-slate-700 mx-1"></div>
            </>
          )}

          {/* Symbol buttons */}
          {activeSymbols.map((symbol) => (
            <button
              key={symbol.value}
              onClick={() => insertSymbol(symbol.value)}
              className="min-w-10 h-10 flex items-center justify-center px-3 rounded-md 
                bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200
                hover:bg-slate-50 dark:hover:bg-slate-600 
                active:bg-slate-100 dark:active:bg-slate-500
                border border-slate-200 dark:border-slate-600
                shadow-sm transition-colors"
              title={symbol.label}
            >
              {symbol.icon ? <symbol.icon size={16} /> : symbol.label}
            </button>
          ))}
        </div>
      </div>
      
      {showSnippets && (
        <div className="absolute bottom-[96px] left-0 right-0 h-64 bg-white dark:bg-slate-800 
          border-t border-slate-200 dark:border-slate-700 shadow-lg rounded-t-lg">
          <SnippetsPanel onInsert={insertSnippet} language={language} />
        </div>
      )}
    </>
  );
};

export default AccessoryBar;