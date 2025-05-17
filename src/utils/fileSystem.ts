import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { create } from 'zustand';

export interface FileSystemError {
  message: string;
  code: string;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  expanded?: boolean;
}

interface FileSystemState {
  currentPath: string;
  files: FileNode[];
  loading: boolean;
  error: FileSystemError | null;
  setFiles: (files: FileNode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: FileSystemError | null) => void;
  setCurrentPath: (path: string) => void;
}

export const useFileSystemStore = create<FileSystemState>((set) => ({
  currentPath: '',
  files: [],
  loading: false,
  error: null,
  setFiles: (files) => set({ files }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentPath: (path) => set({ currentPath: path }),
}));

export async function listDirectory(path: string): Promise<FileNode[]> {
  try {
    // First try to create the directory if it doesn't exist
    try {
      await Filesystem.mkdir({
        path,
        directory: Directory.Documents,
        recursive: true,
      });
    } catch (error) {
      // Ignore error if directory already exists
    }

    const result = await Filesystem.readdir({
      path,
      directory: Directory.Documents,
    });

    const files: FileNode[] = [];
    for (const entry of result.files) {
      const stat = await Filesystem.stat({
        path: `${path}/${entry.name}`,
        directory: Directory.Documents,
      });

      files.push({
        id: stat.uri || `${path}/${entry.name}`,
        name: entry.name,
        type: stat.type === 'directory' ? 'folder' : 'file',
        path: `${path}/${entry.name}`,
        expanded: false,
      });
    }

    return files.sort((a, b) => {
      // Folders first, then files
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error listing directory:', error);
    throw error;
  }
}

export async function createFile(path: string, content: string = ''): Promise<void> {
  try {
    await Filesystem.writeFile({
      path,
      data: content,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

export async function writeFile(path: string, content: string): Promise<void> {
  try {
    await Filesystem.writeFile({
      path,
      data: content,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
}

export async function createDirectory(path: string): Promise<void> {
  try {
    await Filesystem.mkdir({
      path,
      directory: Directory.Documents,
      recursive: true,
    });
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
}

export async function deleteItem(path: string): Promise<void> {
  try {
    await Filesystem.deleteFile({
      path,
      directory: Directory.Documents,
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

export async function renameItem(oldPath: string, newPath: string): Promise<void> {
  try {
    await Filesystem.rename({
      from: oldPath,
      to: newPath,
      directory: Directory.Documents,
    });
  } catch (error) {
    console.error('Error renaming item:', error);
    throw error;
  }
}

export async function readFile(path: string): Promise<string> {
  try {
    const result = await Filesystem.readFile({
      path,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    return result.data;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}