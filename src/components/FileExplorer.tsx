import React, { useState, useEffect } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FixedSizeList as List } from 'react-window';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, RefreshCw, FolderOpen, File, Lock } from 'lucide-react';
import FileDialog from './dialogs/FileDialog';
import { useTabsStore } from '../store/tabsStore';
import { useFileDialogStore } from '../store/fileDialogStore';
import { Capacitor } from '@capacitor/core';

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

  const renderNode = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const node = getFlattenedNodes()[index];
    const Icon = node.type === 'directory' ? (node.expanded ? ChevronDown : ChevronRight) : null;
    const FileTypeIcon = node.type === 'directory' ? FolderOpen : File;
    const level = getNodeLevel(node);

    return (
      <div
        key={node.path}
        className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer overflow-hidden"
        style={{ ...style, paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => {
          setSelectedItem(node);
          handleFileClick(node);
        }}
      >
        {Icon && <Icon size={16} className="min-w-[16px] mr-1 text-gray-600 dark:text-gray-400" />}
        {!Icon && <span className="min-w-[16px] mr-1" />}
        <FileTypeIcon size={16} className="min-w-[16px] mr-2 text-gray-600 dark:text-gray-400" />
        <span className="truncate text-gray-700 dark:text-gray-300">{node.name}</span>
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
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <Lock size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Storage Access Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          To access files on your device, Code Canvas needs permission to access storage.
        </p>
        <button
          onClick={checkPermissions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Grant Permission
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Device Storage
        </h2>
      </div>

      {error && (
        <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-400" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <FolderOpen size={48} className="mb-4 opacity-50" />
            <p>No files found</p>
          </div>
        ) : (
          <>
            <List
              height={500}
              itemCount={getFlattenedNodes().length}
              itemSize={40}
              width={'100%'}
            >
              {renderNode}
            </List>
          </>
        )} 
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