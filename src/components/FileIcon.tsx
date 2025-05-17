import React from 'react';
import {
  FaFolder, FaFile, FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaSass, FaLess,
  FaPython, FaJava, FaPhp, FaDocker, FaGitAlt, FaNpm, FaYarn, FaImage,
  FaFont, FaFileCsv, FaFileAlt, FaFileArchive, FaWindows, FaApple, FaAndroid,
  FaMarkdown, FaKey, FaListAlt, FaCode, FaGlobe, FaCodeBranch, FaBoxOpen, FaCog
} from 'react-icons/fa';
import {
  SiTypescript, SiBabel, SiEslint, SiWebpack, SiVite, SiPrettier, SiJson,
  SiStyledcomponents, SiYaml, SiGo, SiRust, SiDotnet
} from 'react-icons/si';
import { GoGear } from 'react-icons/go';
import * as Di from 'react-icons/di';

interface FileIconProps {
  filename: string;
  isDirectory?: boolean;
  size?: number;
}

const getExtension = (filename: string): string => {
  if (!filename || filename.indexOf('.') === -1) return '';
  if (filename.startsWith('.') && (filename.match(/\./g) || []).length === 1) {
    return filename.substring(1);
  }
  return filename.split('.').pop()?.toLowerCase() || '';
};

const getFilenameLower = (filename: string): string => filename?.toLowerCase() || '';

const FileIcon: React.FC<FileIconProps> = ({
  filename,
  isDirectory = false,
  size = 18
}) => {
  let IconComponent: React.ElementType = FaFile;
  const nameLower = getFilenameLower(filename);
  const ext = getExtension(filename);

  if (isDirectory) {
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
          case 'rb': IconComponent = Di.DiRuby; break;
          case 'php': IconComponent = FaPhp; break;
          case 'go': IconComponent = SiGo; break;
          case 'rs': IconComponent = SiRust; break;
          case 'cs': IconComponent = SiDotnet; break;
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

  return <IconComponent size={size} />;
};

export default FileIcon;