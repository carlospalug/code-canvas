import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TouchCursorProps {
  editor: any;
}

const TouchCursor: React.FC<TouchCursorProps> = ({ editor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [magnifiedText, setMagnifiedText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e: any) => {
      if (e.target.closest('.monaco-editor')) {
        const rect = e.target.getBoundingClientRect();
        setPosition({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        });
        setIsVisible(true);
        updateMagnifiedText();
      }
    };

    const handleTouchEnd = () => {
      setIsVisible(false);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [editor]); // Add editor to dependencies

  const updateMagnifiedText = () => {
    if (!editor) return;
    const currentPosition = editor.getPosition();
    const model = editor.getModel();
    if (!model || !currentPosition) return;

    const textBefore = model.getValueInRange({ startLineNumber: currentPosition.lineNumber, startColumn: Math.max(1, currentPosition.column - 5), endLineNumber: currentPosition.lineNumber, endColumn: currentPosition.column });
    const textAfter = model.getValueInRange({ startLineNumber: currentPosition.lineNumber, startColumn: currentPosition.column, endLineNumber: currentPosition.lineNumber, endColumn: currentPosition.column + 5 });
    setMagnifiedText(textBefore + '|' + textAfter); // Use '|' to represent the cursor position
    };
  }, []);

  const moveCursor = (direction: 'up' | 'down' | 'left' | 'right') => {
    const position = editor.getPosition();
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

    editor.setPosition(newPosition); // Update editor position first
    updateMagnifiedText(); // Then update magnified text based on new position
    editor.focus();
    
  };

  if (!isVisible) return null;

  return (
    <div
      className="absolute z-50 flex flex-col items-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 120}px`
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            onClick={() => moveCursor('up')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronUp size={20} />
          </button>
          <div />
          <button
            onClick={() => moveCursor('left')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="w-8 h-8" />
          <button
            onClick={() => moveCursor('right')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronRight size={20} />
          </button>
          <div />
          <button
            onClick={() => moveCursor('down')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronDown size={20} />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};

export default TouchCursor;