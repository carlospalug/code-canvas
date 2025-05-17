import React from 'react';
import {
  FaFolder, FaFolderOpen, FaFile, FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaSass, FaLess,
  FaPython, FaJava, FaPhp, FaDocker, FaGitAlt, FaNpm, FaYarn, FaImage,
  FaFont, FaFileCsv, FaFileAlt, FaFileArchive, FaWindows, FaApple, FaAndroid,
  FaMarkdown, FaKey, FaListAlt, FaCode, FaGlobe, FaCodeBranch, FaBoxOpen, FaCog
} from 'react-icons/fa';
import {
  SiTypescript, SiBabel, SiEslint, SiWebpack, SiVite, SiPrettier, SiJson,
  SiStyledcomponents, SiYaml, SiGo, SiRust, SiDotnet, SiSwift, SiKotlin, 
  SiC, SiCplusplus, SiCsharp, SiDart, SiElixir, SiGraphql, SiHaskell,
  SiLua, SiPerl, SiPostgresql, SiRuby, SiScala
} from 'react-icons/si';
import { GoGear } from 'react-icons/go';
import * as Di from 'react-icons/di';

interface FileIconProps {
  filename: string;
  isDirectory?: boolean;
  size?: number;
  expanded?: boolean;
}

const getExtension = (filename: string): string => {
  if (!filename || filename.indexOf('.') === -1) return '';
  if (filename.startsWith('.') && (filename.match(/\./g) || []).length === 1) {
    return filename.substring(1);
  }
  return filename.split('.').pop()?.toLowerCase() || '';
};

const getFilenameLower = (filename: string): string => filename?.toLowerCase() || '';

// Helper to get colors for different file types
const getIconColor = (filename: string, isDirectory: boolean): string => {
  if (isDirectory) return '#FFB74D'; // Orange for folders
  
  const ext = getExtension(filename);
  const name = getFilenameLower(filename);
  
  // Configuration files
  if (name.includes('config') || name.includes('.rc'))
    return '#9FA8DA'; // Light indigo
  
  // Package files
  if (name.includes('package.json') || name.includes('yarn.lock'))
    return '#EF5350'; // Red
    
  switch(ext) {
    // JavaScript & TypeScript
    case 'js': case 'jsx': return '#FFCA28'; // Yellow
    case 'ts': case 'tsx': return '#3178C6'; // Blue
    
    // Web files
    case 'html': return '#FF7043'; // Deep Orange
    case 'css': return '#42A5F5'; // Blue
    case 'scss': case 'sass': return '#EC407A'; // Pink
    
    // Data formats
    case 'json': return '#8BC34A'; // Light Green
    case 'xml': return '#BDBDBD'; // Grey
    case 'yaml': case 'yml': return '#78909C'; // Blue Grey
    
    // Markdown/Documentation
    case 'md': return '#5C6BC0'; // Indigo
    case 'txt': return '#90A4AE'; // Blue Grey
    
    // Images
    case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': 
      return '#26A69A'; // Teal
      
    // Other languages
    case 'py': return '#4CAF50'; // Green
    case 'rb': return '#D32F2F'; // Red
    case 'java': return '#F57C00'; // Orange
    case 'kt': return '#7E57C2'; // Deep Purple
    case 'swift': return '#FF8F00'; // Amber
    case 'go': return '#29B6F6'; // Light Blue
    case 'rs': return '#FF7043'; // Deep Orange
    case 'cpp': case 'c': case 'h': return '#5C6BC0'; // Indigo
    
    // Default
    default: return '#90A4AE'; // Blue Grey
  }
};

const FileIcon: React.FC<FileIconProps> = ({
  filename,
  isDirectory = false,
  size = 18,
  expanded = false
}) => {
  const iconColor = getIconColor(filename, isDirectory);
  let IconComponent: React.ElementType = FaFile;
  const nameLower = getFilenameLower(filename);
  const ext = getExtension(filename);

  if (isDirectory) {
    // Use FolderOpen for expanded folders
    if (expanded) {
      IconComponent = FaFolderOpen;
    } else {
      switch (nameLower) {
        case 'node_modules': IconComponent = FaNpm; break;
        case 'src': case 'source': case 'lib': IconComponent = FaCodeBranch; break;
        case 'public': case 'www': case 'static': IconComponent = FaGlobe; break;
        case 'dist': case 'build': case 'out': case 'target': IconComponent = FaBoxOpen; break;
        case '.git': IconComponent = FaGitAlt; break;
        case 'ios': IconComponent = FaApple; break;
        case 'android': IconComponent = FaAndroid; break;
        case 'assets': case 'images': case 'img': case 'icons': IconComponent = FaImage; break;
        case 'components': IconComponent = FaReact; break;
        case 'screens': case 'pages': case 'views': IconComponent = FaReact; break;
        case 'store': case 'redux': case 'vuex': IconComponent = FaCog; break;
        case 'config': case 'settings': IconComponent = GoGear; break;
        default: IconComponent = FaFolder;
      }
    }
  } else {
    switch (nameLower) {
      case 'gradlew.bat': IconComponent = FaWindows; break;
      case 'settings.gradle': case 'build.gradle': IconComponent = Di.DiGradle; break;
      case 'dockerfile': IconComponent = FaDocker; break;
      case 'docker-compose.yml': case 'docker-compose.yaml': IconComponent = FaDocker; break;
      case 'package.json': IconComponent = FaNpm; break;
      case 'package-lock.json': IconComponent = FaNpm; break;
      case 'yarn.lock': IconComponent = FaYarn; break;
      case 'tsconfig.json': IconComponent = SiTypescript; break;
      case 'babel.config.js': case '.babelrc': IconComponent = SiBabel; break;
      case 'eslint.config.js': case '.eslintrc': IconComponent = SiEslint; break;
      case 'webpack.config.js': IconComponent = SiWebpack; break;
      case 'vite.config.js': case 'vite.config.ts': IconComponent = SiVite; break;
      case '.gitignore': case '.gitattributes': IconComponent = FaGitAlt; break;
      case '.env': IconComponent = FaKey; break;
      case '.prettierrc': IconComponent = SiPrettier; break;
      default:
        switch (ext) {
          case 'jsx': case 'tsx': IconComponent = FaReact; break;
          case 'js': IconComponent = FaJsSquare; break;
          case 'ts': IconComponent = SiTypescript; break;
          case 'py': IconComponent = FaPython; break;
          case 'java': IconComponent = FaJava; break;
          case 'kt': case 'kts': IconComponent = SiKotlin; break;
          case 'swift': IconComponent = SiSwift; break;
          case 'c': IconComponent = SiC; break;
          case 'cpp': case 'cc': case 'cxx': case 'h': case 'hpp': IconComponent = SiCplusplus; break;
          case 'cs': IconComponent = SiCsharp; break;
          case 'dart': IconComponent = SiDart; break;
          case 'ex': case 'exs': IconComponent = SiElixir; break;
          case 'go': IconComponent = SiGo; break;
          case 'graphql': case 'gql': IconComponent = SiGraphql; break;
          case 'hs': IconComponent = SiHaskell; break;
          case 'lua': IconComponent = SiLua; break;
          case 'pl': case 'pm': IconComponent = SiPerl; break;
          case 'sql': IconComponent = SiPostgresql; break;
          case 'rb': IconComponent = SiRuby; break;
          case 'rs': IconComponent = SiRust; break;
          case 'scala': IconComponent = SiScala; break;
          case 'html': IconComponent = FaHtml5; break;
          case 'css': IconComponent = FaCss3Alt; break;
          case 'scss': case 'sass': IconComponent = FaSass; break;
          case 'less': IconComponent = FaLess; break;
          case 'md': IconComponent = FaMarkdown; break;
          case 'json': IconComponent = SiJson; break;
          case 'yaml': case 'yml': IconComponent = SiYaml; break;
          case 'csv': IconComponent = FaFileCsv; break;
          case 'txt': case 'text': IconComponent = FaFileAlt; break;
          case 'zip': case 'rar': case 'tar': case 'gz': IconComponent = FaFileArchive; break;
          default: IconComponent = FaFile;
        }
    }
  }

  return (
    <span className="relative flex items-center justify-center">
      <IconComponent 
        size={size} 
        style={{ color: iconColor }}
        className="transition-colors z-10"
      />
      {isDirectory && (
        <span className="absolute inset-0 bg-yellow-50 dark:bg-yellow-900/20 rounded-sm -z-10" />
      )}
    </span>
  );
};

export default FileIcon;