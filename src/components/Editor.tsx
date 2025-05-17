import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { loader } from '@monaco-editor/react';
import { useEditorStore } from '../store/editorStore';
import { useTabsStore } from '../store/tabsStore';
import AccessoryBar from './editor/AccessoryBar';
import TouchCursor from './editor/TouchCursor';
import SnippetsPanel from './editor/SnippetsPanel';
import * as monaco from 'monaco-editor';
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs'
  }
});

interface EditorProps {
  isDark: boolean;
}

const Editor: React.FC<EditorProps> = ({ isDark }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { activeTabId, tabs, updateTabContent } = useTabsStore();
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
        useShadows: false,
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

  editorRef.current = editorInstance;

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
        contextMenu.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
        contextMenu.style.borderRadius = '4px';
        
        const goToDefinitionItem = document.createElement('div');
        goToDefinitionItem.style.padding = '5px 10px';
        goToDefinitionItem.style.cursor = 'pointer';
        goToDefinitionItem.style.userSelect = 'none';
        goToDefinitionItem.innerHTML = 'Go to Definition';
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
        findUsagesItem.style.padding = '5px 10px';
        findUsagesItem.style.cursor = 'pointer';
        findUsagesItem.style.userSelect = 'none';
        findUsagesItem.innerHTML = 'Find Usages';
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
          Loading editor...
        </div>
      }>
        <MonacoEditor
          height="100%"
          language={activeTab.language}
          value={activeTab.content}
          theme={isDark ? "vs-dark" : "light"}
          options={{
            scrollBeyondLastLine: false,
            folding: true,
            automaticLayout: true
          }}
          onMount={handleEditorDidMount}
          loading={
            <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
              Loading editor...
            </div>
          }
        />
        {editor && <TouchCursor editor={editor} />}
        <div className="absolute top-10 right-0 z-10 w-[250px] h-[50%] rounded-md">
          <SnippetsPanel onInsert={onInsertSnippet} language={activeTab.language}/>
        </div>
        {editor && <AccessoryBar editor={editor} language={activeTab.language} />}
      </Suspense>
    </div>
  );
};

export default Editor;