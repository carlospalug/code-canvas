import React, { useState, useCallback } from 'react';
import { Search as SearchIcon, Settings, Loader } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';
import { useFileSystemStore, readFile } from '../utils/fileSystem';
import debounce from '../utils/debounce';

const Search: React.FC = () => {
  const { query, isSearching, results, setQuery, setIsSearching, setResults } = useSearchStore();
  const { files } = useFileSystemStore();
  const [searchSettings, setSearchSettings] = useState({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
    includePattern: '',
    excludePattern: 'node_modules,dist,build',
  });

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const searchResults = [];

      const searchInFile = async (path: string) => {
        try {
          const content = await readFile(path);
          const lines = content.split('\n');
          const matches = [];

          const searchRegex = searchSettings.regex
            ? new RegExp(searchQuery, searchSettings.caseSensitive ? 'g' : 'gi')
            : new RegExp(
                searchSettings.wholeWord
                  ? `\\b${searchQuery}\\b`
                  : searchQuery,
                searchSettings.caseSensitive ? 'g' : 'gi'
              );

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineMatches = [...line.matchAll(searchRegex)];
            
            if (lineMatches.length > 0) {
              matches.push({
                line: i + 1,
                content: line.trim(),
                matches: lineMatches.map(match => ({
                  start: match.index!,
                  end: match.index! + match[0].length,
                })),
              });
            }
          }

          if (matches.length > 0) {
            searchResults.push({
              path,
              matches,
            });
          }
        } catch (error) {
          console.error(`Error searching in file ${path}:`, error);
        }
      };

      const processDirectory = async (nodes: typeof files) => {
        for (const node of nodes) {
          if (node.type === 'file') {
            const excluded = searchSettings.excludePattern
              .split(',')
              .some(pattern => node.path.includes(pattern.trim()));

            const included = !searchSettings.includePattern || 
              searchSettings.includePattern
                .split(',')
                .some(pattern => node.path.includes(pattern.trim()));

            if (!excluded && included) {
              await searchInFile(node.path);
            }
          } else if (node.children) {
            await processDirectory(node.children);
          }
        }
      };

      await processDirectory(files);
      setResults(searchResults);
      setIsSearching(false);
    }, 300),
    [files, searchSettings]
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    performSearch(newQuery);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <SearchIcon 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search in files..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 rounded-lg
              text-gray-900 dark:text-gray-100 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setSearchSettings(s => ({ ...s, caseSensitive: !s.caseSensitive }))}
            className={`px-2 py-1 text-sm rounded ${
              searchSettings.caseSensitive
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Aa
          </button>
          <button
            onClick={() => setSearchSettings(s => ({ ...s, wholeWord: !s.wholeWord }))}
            className={`px-2 py-1 text-sm rounded ${
              searchSettings.wholeWord
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Word
          </button>
          <button
            onClick={() => setSearchSettings(s => ({ ...s, regex: !s.regex }))}
            className={`px-2 py-1 text-sm rounded ${
              searchSettings.regex
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            .*
          </button>
          <button
            onClick={() => {
              const dialog = document.getElementById('search-settings-dialog');
              if (dialog instanceof HTMLDialogElement) {
                dialog.showModal();
              }
            }}
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isSearching ? (
          <div className="flex items-center justify-center h-full">
            <Loader size={24} className="animate-spin text-gray-400" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {results.map((result, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {result.path}
                </h3>
                {result.matches.map((match, j) => (
                  <div
                    key={j}
                    className="pl-4 border-l-2 border-gray-300 dark:border-gray-700 space-y-1"
                  >
                    <div className="text-xs text-gray-500">Line {match.line}</div>
                    <pre className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      {match.content}
                    </pre>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : query && !isSearching ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No results found
          </div>
        ) : null}
      </div>

      <dialog
        id="search-settings-dialog"
        className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-xl w-full max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Search Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Include files (comma-separated patterns)
            </label>
            <input
              type="text"
              value={searchSettings.includePattern}
              onChange={(e) => setSearchSettings(s => ({ ...s, includePattern: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
                dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exclude files (comma-separated patterns)
            </label>
            <input
              type="text"
              value={searchSettings.excludePattern}
              onChange={(e) => setSearchSettings(s => ({ ...s, excludePattern: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 
                dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              const dialog = document.getElementById('search-settings-dialog');
              if (dialog instanceof HTMLDialogElement) {
                dialog.close();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Search;