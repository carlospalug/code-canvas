import React, { useState, useEffect } from 'react';
import { GitBranch, Check, X, RefreshCw } from 'lucide-react';
import { useGitStore } from '../store/gitStore';
import * as git from '../utils/git';
import { DiffEditor } from '@monaco-editor/react';

const Git: React.FC = () => {
  const { branch, files, isLoading, error, setIsLoading, setError } = useGitStore();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [diff, setDiff] = useState<{ old: string; new: string } | null>(null);
  const [commitMessage, setCommitMessage] = useState('');

  const loadStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await git.getCurrentBranch('/');
      await git.getStatus('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleFileClick = async (path: string) => {
    setSelectedFile(path);
    const diffResult = await git.getDiff('/', path);
    if (diffResult) {
      setDiff(diffResult);
    }
  };

  const handleStage = async (path: string) => {
    setIsLoading(true);
    await git.stageFile('/', path);
    await loadStatus();
  };

  const handleUnstage = async (path: string) => {
    setIsLoading(true);
    await git.unstageFile('/', path);
    await loadStatus();
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    setIsLoading(true);
    await git.commit('/', commitMessage);
    setCommitMessage('');
    await loadStatus();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <GitBranch size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {branch}
            </span>
          </div>
          <button
            onClick={loadStatus}
            className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
              ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message"
            className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 rounded-lg
              placeholder-gray-500 text-gray-900 dark:text-gray-100"
            rows={2}
          />
          <button
            onClick={handleCommit}
            disabled={!commitMessage.trim() || isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 
              rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Commit Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex">
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          {files.map((file) => (
            <div
              key={file.path}
              onClick={() => handleFileClick(file.path)}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer
                hover:bg-gray-100 dark:hover:bg-gray-800
                ${selectedFile === file.path ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  file.status === 'modified' ? 'bg-yellow-500' :
                  file.status === 'added' ? 'bg-green-500' :
                  file.status === 'deleted' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                  {file.path}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStage(file.path);
                  }}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Check size={14} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnstage(file.path);
                  }}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={14} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          {selectedFile && diff && (
            <DiffEditor
              height="100%"
              original={diff.old}
              modified={diff.new}
              language="typescript"
              theme="vs-dark"
              options={{
                readOnly: true,
                renderSideBySide: false,
                minimap: { enabled: false },
                lineNumbers: 'off',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Git;