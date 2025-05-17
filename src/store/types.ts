// Common types used across stores
export interface FileTab {
  id: string;
  name: string;
  language: string;
  path: string;
  content: string;
  isDirty: boolean;
}

export interface EditorPosition {
  lineNumber: number;
  column: number;
}

export interface EditorSelection {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface CodeSnippet {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
}

export interface WorkspaceState {
  id: string;
  name: string;
  openFiles: string[];
  activeFile: string | null;
  currentPath: string;
}

export interface GitConfig {
  name: string;
  email: string;
}

export interface EditorConfig {
  fontSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  minimap: boolean;
  whitespace: boolean;
  indentGuides: boolean;
  tabSize: number;
  insertSpaces: boolean;
  autoClosingBrackets: boolean;
  formatOnPaste: boolean;
  formatOnType: boolean;
  gitConfig: GitConfig;
}