import * as git from 'isomorphic-git';
import { Buffer } from 'buffer';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useGitStore } from '../store/gitStore';

// Custom filesystem implementation for isomorphic-git using Capacitor's Filesystem
const fs = {
  promises: {
    async readFile(path: string) {
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Documents,
      });
      return Buffer.from(result.data, 'base64');
    },
    async writeFile(path: string, data: Buffer | string) {
      const content = Buffer.isBuffer(data) ? data.toString('base64') : Buffer.from(data).toString('base64');
      await Filesystem.writeFile({
        path,
        data: content,
        directory: Directory.Documents,
      });
    },
    async unlink(path: string) {
      await Filesystem.deleteFile({
        path,
        directory: Directory.Documents,
      });
    },
    async readdir(path: string) {
      const result = await Filesystem.readdir({
        path,
        directory: Directory.Documents,
      });
      return result.files.map(f => f.name);
    },
    async mkdir(path: string) {
      await Filesystem.mkdir({
        path,
        directory: Directory.Documents,
        recursive: true,
      });
    },
    async stat(path: string) {
      const result = await Filesystem.stat({
        path,
        directory: Directory.Documents,
      });
      return {
        isFile: () => result.type === 'file',
        isDirectory: () => result.type === 'directory',
        size: result.size,
      };
    },
  },
};

export async function initRepo(path: string) {
  try {
    await git.init({ fs, dir: path });
    return true;
  } catch (error) {
    console.error('Error initializing repository:', error);
    return false;
  }
}

export async function getStatus(path: string) {
  try {
    const statusMatrix = await git.statusMatrix({ fs, dir: path });
    const { setFiles } = useGitStore.getState();
    
    const files = statusMatrix.map(([filepath, head, workdir, stage]) => {
      let status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
      
      if (head === 0 && workdir === 2) status = 'added';
      else if (head === 1 && workdir === 0) status = 'deleted';
      else if (head === 1 && workdir === 2) status = 'modified';
      else if (head === 0 && workdir === 0) status = 'untracked';
      else status = 'renamed';

      return { path: filepath, status };
    });

    setFiles(files);
    return files;
  } catch (error) {
    console.error('Error getting status:', error);
    return [];
  }
}

export async function stageFile(path: string, filepath: string) {
  try {
    await git.add({ fs, dir: path, filepath });
    return true;
  } catch (error) {
    console.error('Error staging file:', error);
    return false;
  }
}

export async function unstageFile(path: string, filepath: string) {
  try {
    await git.remove({ fs, dir: path, filepath });
    return true;
  } catch (error) {
    console.error('Error unstaging file:', error);
    return false;
  }
}

export async function commit(path: string, message: string) {
  try {
    const result = await git.commit({
      fs,
      dir: path,
      message,
      author: {
        name: 'Code Canvas User',
        email: 'user@codecanvas.app',
      },
    });
    return result;
  } catch (error) {
    console.error('Error committing changes:', error);
    return null;
  }
}

export async function getCurrentBranch(path: string) {
  try {
    const branch = await git.currentBranch({ fs, dir: path });
    const { setBranch } = useGitStore.getState();
    setBranch(branch || 'main');
    return branch;
  } catch (error) {
    console.error('Error getting current branch:', error);
    return null;
  }
}

export async function getDiff(path: string, filepath: string) {
  try {
    const oldFile = await git.readBlob({
      fs,
      dir: path,
      oid: 'HEAD',
      filepath,
    });

    const newFile = await fs.promises.readFile(`${path}/${filepath}`);

    return {
      old: oldFile.blob.toString('utf8'),
      new: newFile.toString('utf8'),
    };
  } catch (error) {
    console.error('Error getting diff:', error);
    return null;
  }
}