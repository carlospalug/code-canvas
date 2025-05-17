import React, { useState } from 'react';
import { Bot, X, Loader, FileCode } from 'lucide-react';
import { generateCode } from '../utils/ai';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    files: Array<{ name: string; content: string }>;
    explanation: string;
  } | null>(null);

  const ensureDirectoryExists = async (path: string) => {
    try {
      const dirs = path.split('/').filter(Boolean);
      let currentPath = '';
      
      for (const dir of dirs) {
        currentPath += `/${dir}`;
        try {
          await Filesystem.mkdir({
            path: currentPath,
            directory: Directory.ExternalStorage,
            recursive: true
          });
        } catch (error: any) {
          // Ignore error if directory already exists
          if (!error.message?.includes('exists')) {
            throw error;
          }
        }
      }
    } catch (error: any) {
      console.error('Error creating directory:', error);
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  };

  const writeFile = async (path: string, content: string) => {
    try {
      // Ensure parent directory exists
      const parentDir = path.substring(0, path.lastIndexOf('/'));
      if (parentDir) {
        await ensureDirectoryExists(parentDir);
      }

      // Write the file
      await Filesystem.writeFile({
        path,
        data: content,
        directory: Directory.ExternalStorage,
        encoding: Encoding.UTF8,
        recursive: true
      });

      // Verify file was created
      const stat = await Filesystem.stat({
        path,
        directory: Directory.ExternalStorage
      });

      if (!stat) {
        throw new Error('File was not created successfully');
      }

      return true;
    } catch (error: any) {
      console.error('Error writing file:', error);
      throw new Error(`Failed to write file ${path}: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await generateCode(prompt);
      setResult(response);

      // Create files sequentially with proper error handling
      for (const file of response.files) {
        try {
          await writeFile(file.name, file.content);
        } catch (error: any) {
          throw new Error(`Failed to create file ${file.name}: ${error.message}`);
        }
      }

      // Clear the form and show success
      setPrompt('');
      setResult(null);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bot className="text-blue-500" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What would you like me to create?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create (e.g., 'Create a React component for a todo list with TypeScript')"
                className="w-full h-32 px-4 py-2 text-gray-900 dark:text-gray-100 
                  bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 
                  dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 
                border-red-500 rounded">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Generating and Creating Files...
                </>
              ) : (
                <>
                  <Bot size={18} />
                  Generate and Create Files
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;