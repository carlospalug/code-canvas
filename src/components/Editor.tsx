import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { loader } from '@monaco-editor/react';
import { useEditorStore } from '../store/editorStore';
import { useTabsStore } from '../store/tabsStore';
import { useThemeStore } from '../store/themeStore';
import AccessoryBar from './editor/AccessoryBar';
import TouchCursor from './editor/TouchCursor';
import SnippetsPanel from './editor/SnippetsPanel';
import { Settings } from 'lucide-react';
import * as monaco from 'monaco-editor';
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs'
  }
});

// List of available themes
const editorThemes = [
  { id: 'vs-dark', name: 'Dark (Default)', type: 'dark' },
  { id: 'vs', name: 'Light', type: 'light' },
  { id: 'github-dark', name: 'GitHub Dark', type: 'dark' },
  { id: 'github-light', name: 'GitHub Light', type: 'light' },
  { id: 'monokai', name: 'Monokai', type: 'dark' },
  { id: 'dracula', name: 'Dracula', type: 'dark' },
  { id: 'solarized-dark', name: 'Solarized Dark', type: 'dark' },
  { id: 'solarized-light', name: 'Solarized Light', type: 'light' }
];

interface EditorProps {
  isDark: boolean;
}

const Editor: React.FC<EditorProps> = ({ isDark }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { activeTabId, tabs, updateTabContent } = useTabsStore();
  const { theme: selectedTheme, setTheme } = useEditorStore();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { 
    fontSize,
    lineNumbers,
    wordWrap,
    minimap,
    whitespace,
    indentGuides,
    tabSize,
    insertSpaces,
    autoClosingBrackets,
    formatOnPaste,
    formatOnType
  } = useEditorStore();

  const activeTab = tabs.find(t => t.id === activeTabId);
  
  const themeToUse = selectedTheme || (isDark ? 'vs-dark' : 'vs');

  // Define custom themes
  useEffect(() => {
    if (!monaco.editor) return;

    // GitHub Dark theme
    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' }
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editorCursor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#c9d1d9',
        'editor.selectionBackground': '#3b5070',
      }
    });

    // GitHub Light theme
    monaco.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d' },
        { token: 'keyword', foreground: 'd73a49' },
        { token: 'string', foreground: '032f62' },
        { token: 'number', foreground: '005cc5' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorCursor.foreground': '#24292e',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editorLineNumber.foreground': '#1b1f234d',
        'editorLineNumber.activeForeground': '#24292e',
        'editor.selectionBackground': '#c8c8fa',
      }
    });

    // Monokai theme
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715e' },
        { token: 'keyword', foreground: 'f92672' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' }
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editorCursor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#3e3d32',
        'editorLineNumber.foreground': '#90908a',
        'editorLineNumber.activeForeground': '#f8f8f2',
        'editor.selectionBackground': '#49483e',
      }
    });

    // Dracula theme
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' }
      ],
      colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editorCursor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#44475a',
        'editorLineNumber.foreground': '#6272a4',
        'editorLineNumber.activeForeground': '#f8f8f2',
        'editor.selectionBackground': '#44475a',
      }
    });

    // Solarized Dark theme
    monaco.editor.defineTheme('solarized-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '657b83' },
        { token: 'keyword', foreground: 'cb4b16' },
        { token: 'string', foreground: '2aa198' },
        { token: 'number', foreground: 'd33682' }
      ],
      colors: {
        'editor.background': '#002b36',
        'editor.foreground': '#839496',
        'editorCursor.foreground': '#839496',
        'editor.lineHighlightBackground': '#073642',
        'editorLineNumber.foreground': '#586e75',
        'editorLineNumber.activeForeground': '#839496',
        'editor.selectionBackground': '#073642',
      }
    });

    // Solarized Light theme
    monaco.editor.defineTheme('solarized-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '93a1a1' },
        { token: 'keyword', foreground: 'cb4b16' },
        { token: 'string', foreground: '2aa198' },
        { token: 'number', foreground: 'd33682' }
      ],
      colors: {
        'editor.background': '#fdf6e3',
        'editor.foreground': '#657b83',
        'editorCursor.foreground': '#657b83',
        'editor.lineHighlightBackground': '#eee8d5',
        'editorLineNumber.foreground': '#93a1a1',
        'editorLineNumber.activeForeground': '#657b83',
        'editor.selectionBackground': '#eee8d5',
      }
    });
  }, []);

  // Detect language based on content
  useEffect(() => {
    if (editor && activeTab && !activeTab.language) {
      const content = activeTab.content.trim().toLowerCase();
      let detectedLanguage = 'plaintext';

      if (content.startsWith('<!doctype html') || content.includes('<html')) {
        detectedLanguage = 'html';
      } else if (content.includes('function') || content.includes('const ') || content.includes('let ')) {
        detectedLanguage = content.includes('interface') || content.includes(': ') ? 'typescript' : 'javascript';
      } else if (content.includes('{') && content.includes('}')) {
        detectedLanguage = 'json';
      } else if (content.includes('.class') || content.includes('#id')) {
        detectedLanguage = 'css';
      }

      updateTabContent(activeTab.id, activeTab.content, detectedLanguage);
    }
  }, [editor, activeTab?.content]);

  const handleEditorDidMount = (editorInstance: any) => {
    setEditor(editorInstance);
    editorRef.current = editorInstance;

    editorInstance.updateOptions({
      fontSize,
      lineHeight: Math.floor(fontSize * 1.5),
      minimap: { enabled: minimap },
      lineNumbers: lineNumbers ? 'on' : 'off',
      wordWrap: wordWrap ? 'on' : 'off',
      renderWhitespace: whitespace ? 'all' : 'none',
      renderIndentGuides: indentGuides,
      tabSize,
      insertSpaces,
      autoClosingBrackets,
      formatOnPaste,
      formatOnType,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        useShadows: true,
        alwaysConsumeMouseWheel: false
      },
      padding: { top: 20, bottom: 20 },
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      mouseWheelZoom: true,
      bracketPairColorization: { enabled: true },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
      fontLigatures: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 3,
      links: false,
      contextmenu: false,
      mouseWheelScrollSensitivity: 1.5,
      touchBar: true,
      selectOnLineNumbers: true,
      selectionHighlight: true,
      occurrencesHighlight: false
    });

    editorInstance.onDidChangeModelContent(() => {
      const content = editorInstance.getValue();
      if (activeTabId) {
        updateTabContent(activeTabId, content);
      }
    });
  };

  const onInsertSnippet = (code: string) => {
    if (editor) {
      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits("", [{
          range: selection,
          text: code,
          forceMoveMarkers: true
        }]);
      }
    }
  };

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    setShowThemeSelector(false);
  };

  useEffect(() => {
    if (editor) {
      const handleContextMenu = (event: monaco.editor.IEditorMouseEvent) => {
        event.preventDefault();
        if (!editorRef.current) {
          return;
        }

        const model = editorRef.current.getModel();
        if (!model) {
          return;
        }

        const position = event.target.position;
        if (!position) return;

        const word = model.getWordAtPosition(position);
        if (!word) return;

        const contextMenu = document.createElement('div');
        contextMenu.style.position = 'absolute';
        contextMenu.style.left = `${event.event.posx}px`;
        contextMenu.style.top = `${event.event.posy}px`;
        contextMenu.style.backgroundColor = 'var(--vscode-menu-background)';
        contextMenu.style.border = '1px solid var(--vscode-menu-border)';
        contextMenu.style.color = 'var(--vscode-menu-foreground)';
        contextMenu.style.boxShadow = '0px 2px 8px rgba(0, 0, 0, 0.15)';
        contextMenu.style.borderRadius = '6px';
        contextMenu.style.overflow = 'hidden';
        contextMenu.style.zIndex = '1000';
        
        const goToDefinitionItem = document.createElement('div');
        goToDefinitionItem.style.padding = '8px 12px';
        goToDefinitionItem.style.cursor = 'pointer';
        goToDefinitionItem.style.userSelect = 'none';
        goToDefinitionItem.style.fontSize = '14px';
        goToDefinitionItem.style.display = 'flex';
        goToDefinitionItem.style.alignItems = 'center';
        goToDefinitionItem.style.gap = '8px';
        goToDefinitionItem.innerHTML = '<span style="flex-shrink: 0; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">📌</span> Go to Definition';
        goToDefinitionItem.addEventListener('click', () => {
          const definition = model.getWordAtPosition(position);
          if (!definition) return;

          editor.revealPositionInCenter({
            lineNumber: definition.startLineNumber,
            column: definition.startColumn
          });
          contextMenu.remove();
        });

        const findUsagesItem = document.createElement('div');
        findUsagesItem.style.padding = '8px 12px';
        findUsagesItem.style.cursor = 'pointer';
        findUsagesItem.style.userSelect = 'none';
        findUsagesItem.style.fontSize = '14px';
        findUsagesItem.style.display = 'flex';
        findUsagesItem.style.alignItems = 'center';
        findUsagesItem.style.gap = '8px';
        findUsagesItem.innerHTML = '<span style="flex-shrink: 0; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">🔍</span> Find All References';
        findUsagesItem.addEventListener('click', () => {
          const wordToFind = word.word;
          const allMatches = model.findMatches(wordToFind, false, true, false, null, true);

          allMatches.forEach(match => {
            editor.setSelection(match.range);
          });
          contextMenu.remove();
        });
        
        contextMenu.appendChild(goToDefinitionItem);
        contextMenu.appendChild(findUsagesItem);

        document.body.appendChild(contextMenu);
        
        // Add event listener to remove context menu when clicking outside
        const removeMenu = (e: MouseEvent) => {
          if (!contextMenu.contains(e.target as Node)) {
            contextMenu.remove();
            document.removeEventListener('click', removeMenu);
          }
        };
        
        setTimeout(() => {
          document.addEventListener('click', removeMenu);
        }, 0);
      };

      editor.onMouseDown(handleContextMenu);
    }
  }, [editor]);

  if (!activeTab) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
        Open a file to start editing
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Loading editor...</p>
          </div>
        </div>
      }>
        <div className="relative h-full">
          {/* Theme selector button */}
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="absolute top-2 right-2 z-20 p-2 bg-white/80 dark:bg-gray-800/80 rounded-md shadow-md backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={18} />
          </button>
          
          {/* Theme selector dropdown */}
          {showThemeSelector && (
            <div className="absolute top-12 right-2 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-52">
              <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
              </div>
              <div className="max-h-80 overflow-y-auto p-1">
                {editorThemes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedTheme === theme.id 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <MonacoEditor
            height="100%"
            language={activeTab.language}
            value={activeTab.content}
            theme={themeToUse}
            options={{
              scrollBeyondLastLine: false,
              folding: true,
              automaticLayout: true
            }}
            onMount={handleEditorDidMount}
            loading={
              <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p>Loading editor...</p>
                </div>
              </div>
            }
          />
          {editor && <TouchCursor editor={editor} />}
          <div className="absolute top-10 right-0 z-10 w-[250px] h-[50%] rounded-md">
            <SnippetsPanel onInsert={onInsertSnippet} language={activeTab.language}/>
          </div>
          {editor && <AccessoryBar editor={editor} language={activeTab.language} />}
        </div>
      </Suspense>
    </div>
  );
};

export default Editor;