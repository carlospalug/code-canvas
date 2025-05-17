import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Copy, Nut as Cut, Cast as Paste } from 'lucide-react';

interface TouchCursorProps {
  editor: any;
}

const TouchCursor: React.FC<TouchCursorProps> = ({ editor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [magnifiedText, setMagnifiedText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.target instanceof Element && e.target.closest('.monaco-editor')) {
        const editorElement = e.target.closest('.monaco-editor');
        if (!editorElement) return;
        
        const rect = editorElement.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        setPosition({ x, y });
        setIsVisible(true);
        setExpanded(false);
        updateMagnifiedText();
        
        // Position the cursor at touch location in the editor
        if (editor) {
          const position = editor.getPositionAt(e.touches[0].clientX, e.touches[0].clientY);
          if (position) {
            editor.setPosition(position);
            editor.focus();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      // Don't immediately hide, let the user interact with the controls
      setTimeout(() => {
        if (!expanded) {
          setIsVisible(false);
        }
      }, 300);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [editor, expanded]);

  const updateMagnifiedText = () => {
    if (!editor) return;
    
    try {
      const currentPosition = editor.getPosition();
      const model = editor.getModel();
      if (!model || !currentPosition) return;

      const lineContent = model.getLineContent(currentPosition.lineNumber);
      
      // Get text surrounding the cursor
      const before = currentPosition.column > 6
        ? lineContent.substring(currentPosition.column - 6, currentPosition.column - 1)
        : lineContent.substring(0, currentPosition.column - 1);
        
      const after = lineContent.substring(
        currentPosition.column - 1,
        Math.min(currentPosition.column + 5, lineContent.length)
      );
      
      setMagnifiedText(before + '|' + after);
      
      // Continue updating the text if the cursor moves
      animationFrameRef.current = requestAnimationFrame(updateMagnifiedText);
    } catch (error) {
      console.error('Error updating magnified text:', error);
    }
  };

  const moveCursor = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!editor) return;
    
    const position = editor.getPosition();
    if (!position) return;
    
    let newPosition;

    switch (direction) {
      case 'up':
        newPosition = { lineNumber: position.lineNumber - 1, column: position.column };
        break;
      case 'down':
        newPosition = { lineNumber: position.lineNumber + 1, column: position.column };
        break;
      case 'left':
        newPosition = { lineNumber: position.lineNumber, column: position.column - 1 };
        break;
      case 'right':
        newPosition = { lineNumber: position.lineNumber, column: position.column + 1 };
        break;
    }

    editor.setPosition(newPosition);
    editor.focus();
  };

  const copySelection = () => {
    if (!editor) return;
    
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || selection.isEmpty() || !model) {
      // If no selection, copy the current line
      const position = editor.getPosition();
      if (position) {
        const lineContent = model.getLineContent(position.lineNumber);
        navigator.clipboard.writeText(lineContent);
      }
      return;
    }
    
    const text = model.getValueInRange(selection);
    navigator.clipboard.writeText(text);
  };

  const cutSelection = () => {
    if (!editor) return;
    
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || selection.isEmpty() || !model) {
      // If no selection, cut the current line
      const position = editor.getPosition();
      if (position) {
        const lineContent = model.getLineContent(position.lineNumber);
        navigator.clipboard.writeText(lineContent);
        editor.executeEdits('', [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: model.getLineMaxColumn(position.lineNumber)
            },
            text: ''
          }
        ]);
      }
      return;
    }
    
    const text = model.getValueInRange(selection);
    navigator.clipboard.writeText(text);
    editor.executeEdits('', [
      {
        range: selection,
        text: ''
      }
    ]);
  };

  const pasteContent = async () => {
    if (!editor) return;
    
    try {
      const text = await navigator.clipboard.readText();
      const selection = editor.getSelection();
      
      editor.executeEdits('', [
        {
          range: selection,
          text
        }
      ]);
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed z-50 flex flex-col items-center transition-all duration-200 ease-in-out ${
        expanded ? 'scale-110' : 'scale-100'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${expanded ? position.y - 180 : position.y - 120}px`
      }}
    >
      {/* Magnified text display */}
      <div className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-2 border border-blue-100 dark:border-blue-900 font-mono text-sm">
        <div className="overflow-hidden max-w-[200px] whitespace-nowrap text-gray-800 dark:text-gray-200">
          {magnifiedText.replace('|', '').length > 0 ? (
            <>
              {magnifiedText.split('|').map((part, i) => (
                <React.Fragment key={i}>
                  {i === 1 && <span className="text-blue-600 dark:text-blue-400 animate-pulse">|</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </>
          ) : (
            <span className="text-blue-600 dark:text-blue-400 animate-pulse">|</span>
          )}
        </div>
      </div>

      {/* Main cursor controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-blue-100 dark:border-blue-900 transition-all">
        <div className="grid grid-cols-3 gap-2">
          {/* Toggle expanded mode button */}
          <div className="col-span-3 mb-1">
            <button
              onClick={toggleExpanded}
              className="w-full text-center text-xs font-medium py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            >
              {expanded ? "Basic Mode" : "Advanced Mode"}
            </button>
          </div>
          
          <div />
          <button
            onClick={() => moveCursor('up')}
            className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 rounded-lg transition-all duration-150"
            aria-label="Move cursor up"
          >
            <ChevronUp size={20} strokeWidth={2.5} />
          </button>
          <div />

          <button
            onClick={() => moveCursor('left')}
            className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 rounded-lg transition-all duration-150"
            aria-label="Move cursor left"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="w-2 h-4 bg-blue-500 animate-pulse rounded-sm"></div>
          </div>
          <button
            onClick={() => moveCursor('right')}
            className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 rounded-lg transition-all duration-150"
            aria-label="Move cursor right"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          <div />
          <button
            onClick={() => moveCursor('down')}
            className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 rounded-lg transition-all duration-150"
            aria-label="Move cursor down"
          >
            <ChevronDown size={20} strokeWidth={2.5} />
          </button>
          <div />
          
          {/* Extended controls only shown when expanded */}
          {expanded && (
            <>
              <div className="col-span-3 h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
              
              <button
                onClick={copySelection}
                className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 active:scale-95 rounded-lg transition-all duration-150 flex items-center justify-center gap-1"
                aria-label="Copy"
              >
                <Copy size={16} />
                <span className="text-xs">Copy</span>
              </button>
              
              <button
                onClick={cutSelection}
                className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 active:scale-95 rounded-lg transition-all duration-150 flex items-center justify-center gap-1"
                aria-label="Cut"
              >
                <Cut size={16} />
                <span className="text-xs">Cut</span>
              </button>
              
              <button
                onClick={pasteContent}
                className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 rounded-lg transition-all duration-150 flex items-center justify-center gap-1"
                aria-label="Paste"
              >
                <Paste size={16} />
                <span className="text-xs">Paste</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TouchCursor;