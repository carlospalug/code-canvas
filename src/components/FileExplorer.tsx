import React, { useState, useEffect } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FixedSizeList as List } from 'react-window';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, RefreshCw, FolderOpen, Lock } from 'lucide-react';
import FileDialog from './dialogs/FileDialog';
import { useTabsStore } from '../store/tabsStore';
import { useFileDialogStore } from '../store/fileDialogStore';
import { Capacitor } from '@capacitor/core';
import FileIcon from './FileIcon'; // Import the FileIcon component

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
}

const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FileNode | null>(null);
  const [hasPermissions, setHasPermissions] = useState(false);

  const { addTab } = useTabsStore();
  const { dialogType, isOpen, closeDialog } = useFileDialogStore();

  const checkPermissions = async () => {
    try {
      const { publicStorage } = await Filesystem.checkPermissions();
      if (publicStorage !== 'granted') {
        const result = await Filesystem.requestPermissions();
        setHasPermissions(result.publicStorage === 'granted');
      } else {
        setHasPermissions(true);
      }
    } catch (err) {
      setHasPermissions(false);
      setError('Storage permissions are required to access files');
    }
  };

  const loadFiles = async (path: string = ''): Promise<FileNode[]> => {
    try {
      const result = await Filesystem.readdir({
        path,
        directory: Directory.ExternalStorage
      });

      const nodes: FileNode[] = [];
      for (const entry of result.files) {
        const stat = await Filesystem.stat({
          path: `${path}/${entry.name}`,
          directory: Directory.ExternalStorage
        });

        nodes.push({
          name: entry.name,
          path: `${path}/${entry.name}`,
          type: stat.type === 'directory' ? 'directory' : 'file',
          expanded: false
        });
      }

      return nodes.sort((a, b) => {
        if (a.type === 'directory' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (err: any) {
      console.error('Error loading files:', err);
      setError(err.message);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await checkPermissions();
        if (hasPermissions) {
          const nodes = await loadFiles();
          setFiles(nodes);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hasPermissions]);

  const handleFileClick = async (node: FileNode) => {
    if (!hasPermissions) {
      await checkPermissions();
      return;
    }

    if (node.type === 'directory') {
      const updatedFiles = [...files];
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(n => {
          if (n.path === node.path) {
            if (!n.expanded) {
              loadFiles(n.path).then(children => {
                n.children = children;
                setFiles([...updatedFiles]);
              });
            }
            return { ...n, expanded: !n.expanded };
          }
          if (n.children) {
            return { ...n, children: updateNode(n.children) };
          }
          return n;
        });
      };
      setFiles(updateNode(updatedFiles));
    } else {
      try {
        const result = await Filesystem.readFile({
          path: node.path,
          directory: Directory.ExternalStorage,
          encoding: Encoding.UTF8
        });

        const extension = node.name.split('.').pop()?.toLowerCase() || '';
        const language = getLanguageFromExtension(extension);
        
        addTab({
          name: node.name,
          path: node.path,
          language,
          content: result.data
        });
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleCreateItem = async (name: string) => {
    try {
      const basePath = selectedItem?.type === 'directory' ? selectedItem.path : '';
      const fullPath = basePath ? `${basePath}/${name}` : name;

      if (dialogType === 'create-file') {
        await Filesystem.writeFile({
          path: fullPath,
          data: '',
          directory: Directory.ExternalStorage,
          encoding: Encoding.UTF8,
        });

        // Open the new file in the editor
        addTab({
          name,
          path: fullPath,
          language: getLanguageFromExtension(name.split('.').pop() || ''),
          content: ''
        });
      } else {
        await Filesystem.mkdir({
          path: fullPath,
          directory: Directory.ExternalStorage,
          recursive: true,
        });
      }

      // Refresh the file list
      const nodes = await loadFiles();
      setFiles(nodes);
      closeDialog();
    } catch (error) {
      console.error('Error creating item:', error);
      setError('Failed to create item');
    }
  };

  const getLanguageFromExtension = (ext: string): string => {
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'json': 'json',
      'md': 'markdown'
    };
    return languageMap[ext] || 'plaintext';
  };

  // Function to render tree indentation guides
  const renderIndentGuides = (level: number) => {
    if (level === 0) return null;
    
    return (
      <div className="absolute left-0 top-0 bottom-0" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: level }).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 bottom-0 border-l border-gray-200 dark:border-gray-700" 
            style={{ left: `${(i * 16) + 10}px` }}
          />
        ))}
      </div>
    );
  };

  const renderNode = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const node = getFlattenedNodes()[index];
    const Icon = node.type === 'directory' ? (node.expanded ? ChevronDown : ChevronRight) : null;
    const level = getNodeLevel(node);

    return (
      <div
        key={node.path}
        className={`relative flex items-center py-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md cursor-pointer overflow-hidden group mx-1 ${
          selectedItem?.path === node.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
        }`}
        style={{ 
          ...style, 
          paddingLeft: `${level * 16 + 12}px`,
          height: '34px' // Fixed height for tree items
        }}
        onClick={() => {
          setSelectedItem(node);
          handleFileClick(node);
        }}
      >
        {/* Render indent guides */}
        {renderIndentGuides(level)}
        
        {Icon && (
          <span className="inline-flex mr-1 relative z-10">
            <Icon size={18} className="text-gray-400 dark:text-gray-500" />
          </span>
        )}
        {!Icon && <span className="w-[18px] mr-1" />}
        
        {/* File/Directory Icon */}
        <span className="inline-flex items-center justify-center w-5 h-5 mr-2 transition-colors">
          <FileIcon 
            filename={node.name} 
            isDirectory={node.type === 'directory'} 
            size={16} 
            expanded={node.expanded}
          />
        </span>
        
        {/* Filename */}
        <span className={`truncate text-sm relative z-10 ${
          selectedItem?.path === node.path 
            ? 'font-medium text-blue-700 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
        }`}>
          {node.name}
        </span>
        
        {/* Hover action buttons - shown on hover only */}
        <div className="absolute right-1 opacity-0 group-hover:opacity-100 flex transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement edit functionality
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement delete functionality
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  const getFlattenedNodes = (): FileNode[] => {
    const flattened: FileNode[] = [];
    const flatten = (nodes: FileNode[], level: number) => {
      nodes.forEach(node => {
        flattened.push(node);
        if (node.type === 'directory' && node.expanded && node.children) {
          flatten(node.children, level + 1);
        }
      });
    };
    flatten(files, 0);
    return flattened;
  };

  const getNodeLevel = (node: FileNode, rootNodes = files, level = 0): number => {
    for (const rootNode of rootNodes) {
      if (rootNode.path === node.path) return level;
      if (rootNode.children) {
        const childLevel = getNodeLevel(node, rootNode.children, level + 1);
        if (childLevel !== -1) return childLevel;
      }
    }
    return -1;
  };

  if (!hasPermissions) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-5 shadow-md">
          <Lock size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold font-heading text-gray-900 dark:text-gray-100 mb-3">
          Storage Access Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
          To access files on your device, Code Canvas needs permission to access storage.
        </p>
        <button
          onClick={checkPermissions}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-colors flex items-center space-x-2"
        >
          <span>Grant Permission</span>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium font-heading text-gray-900 dark:text-gray-100">
          Device Storage
        </h2>
        <div className="flex space-x-1">
          <button 
            onClick={() => loadFiles().then(nodes => setFiles(nodes))}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-blue-500" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FolderOpen size={28} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-center mb-2">No files found</p>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 max-w-xs">
              Click the + button to create a new file or folder
            </p>
          </div>
        ) : (
          <>
            <List
              height={500}
              itemCount={getFlattenedNodes().length}
              itemSize={34}
              width={'100%'}
              className="no-scrollbar"
              overscanCount={10}
            >
              {renderNode}
            </List>
          </>
        )} 
      </div>

      {/* Floating action button for creating new files/folders */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => { 
            useFileDialogStore.getState().openDialog('create-folder');
          }}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          title="New Folder"
        >
          <FolderOpen size={20} />
        </button>
        <button
          onClick={() => { 
            useFileDialogStore.getState().openDialog('create-file'); 
          }}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          title="New File"
        >
          <Plus size={20} />
        </button>
      </div>

      <FileDialog
        type={dialogType || 'create-file'}
        isOpen={isOpen}
        onClose={closeDialog}
        onConfirm={handleCreateItem}
        itemType={dialogType === 'create-file' ? 'file' : 'folder'}
      />
    </div>
  );
};

export default FileExplorer;