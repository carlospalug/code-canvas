import React from 'react';
import { useEditorStore } from '../store/editorStore';

const Settings: React.FC = () => {
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
    formatOnType,
    gitConfig,
    setFontSize,
    toggleLineNumbers,
    toggleWordWrap,
    toggleMinimap,
    toggleWhitespace,
    toggleIndentGuides,
    setTabSize,
    toggleInsertSpaces,
    toggleAutoClosingBrackets,
    toggleFormatOnPaste,
    toggleFormatOnType,
    updateGitConfig
  } = useEditorStore();

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-300">Editor Settings</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Tab Size: {tabSize}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                step="2"
                value={tabSize}
                onChange={(e) => setTabSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {[
              { label: 'Line Numbers', checked: lineNumbers, toggle: toggleLineNumbers },
              { label: 'Word Wrap', checked: wordWrap, toggle: toggleWordWrap },
              { label: 'Minimap', checked: minimap, toggle: toggleMinimap },
              { label: 'Show Whitespace', checked: whitespace, toggle: toggleWhitespace },
              { label: 'Indent Guides', checked: indentGuides, toggle: toggleIndentGuides },
              { label: 'Insert Spaces', checked: insertSpaces, toggle: toggleInsertSpaces },
              { label: 'Auto Closing Brackets', checked: autoClosingBrackets, toggle: toggleAutoClosingBrackets },
              { label: 'Format on Paste', checked: formatOnPaste, toggle: toggleFormatOnPaste },
              { label: 'Format on Type', checked: formatOnType, toggle: toggleFormatOnType },
            ].map(({ label, checked, toggle }) => (
              <label key={label} className="flex items-center space-x-3 text-base text-gray-900 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={toggle}
                  className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-300">Git Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={gitConfig.name}
                onChange={(e) => updateGitConfig({ name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
                  dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={gitConfig.email}
                onChange={(e) => updateGitConfig({ email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
                  dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;