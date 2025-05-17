// VS Code-style file icons mapping
export const fileIcons = {
  // Configuration files
  'package.json': '📦',
  'tsconfig.json': '⚙️',
  'babel.config.js': '🔧',
  'jest.config.js': '🃏',
  '.env': '🔑',
  '.gitignore': '👁️',
  
  // Source files
  '.ts': '📘',
  '.tsx': '📘',
  '.js': '📒',
  '.jsx': '📒',
  '.css': '🎨',
  '.scss': '🎨',
  '.html': '🌐',
  '.md': '📝',
  '.json': '📋',
  
  // Build files
  'build.gradle': '🏗️',
  'gradlew': '🏗️',
  'gradlew.bat': '🏗️',
  
  // Default icons
  'folder': '📁',
  'file': '📄'
};

export function getFileIcon(filename: string): string {
  // Check for exact filename matches first
  if (fileIcons[filename]) {
    return fileIcons[filename];
  }

  // Check file extension
  const ext = '.' + filename.split('.').pop();
  if (fileIcons[ext]) {
    return fileIcons[ext];
  }

  return fileIcons.file;
}

export function getFolderIcon(expanded: boolean): string {
  return expanded ? '📂' : '📁';
}

export function getLanguageColor(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return '#3178c6';
    case 'js':
    case 'jsx':
      return '#f7df1e';
    case 'css':
      return '#264de4';
    case 'scss':
      return '#cc6699';
    case 'html':
      return '#e34c26';
    case 'json':
      return '#292929';
    case 'md':
      return '#083fa1';
    default:
      return '#666666';
  }
}

export function getLanguageName(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
      return 'TypeScript';
    case 'tsx':
      return 'React TSX';
    case 'js':
      return 'JavaScript';
    case 'jsx':
      return 'React JSX';
    case 'css':
      return 'CSS';
    case 'scss':
      return 'SCSS';
    case 'html':
      return 'HTML';
    case 'json':
      return 'JSON';
    case 'md':
      return 'Markdown';
    default:
      return 'Plain Text';
  }
}