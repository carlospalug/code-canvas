import React from 'react';

// SVG icons for different file types
export const LanguageIcons = {
  typescript: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 8v8h16V0H0v8zm13-5.25v.75H7.75v2H13v.75H7.75v2.75h-.75V6.25h-2v2.75h-.75V6.25H2v-.75h2.25v-2H2v-.75h2.25V0h.75v2.75h2V0h.75v2.75H13z" fill="#3178C6"/>
    </svg>
  ),
  javascript: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0v16h16V0H0zm8.75 12.5c0 1.5-.75 2.25-2 2.25-1 0-1.75-.5-2-1.25l1-.5c.125.375.375.75 1 .75.5 0 .875-.25.875-1V7h1.125v5.5zm2.75 2.25c-1.25 0-2-.5-2.25-1.25l1-.5c.25.5.625 1 1.375 1 .625 0 1-.25 1-.75 0-.5-.375-.625-1.125-.875l-.375-.125c-1.125-.375-1.75-.875-1.75-2 0-1 .75-1.75 2-1.75.875 0 1.5.25 2 1l-1 .5c-.125-.375-.375-.625-.875-.625-.375 0-.625.25-.625.625 0 .375.25.5 1 .75l.375.125c1.25.375 2 .875 2 2 0 1.125-.875 1.875-2.125 1.875z" fill="#F7DF1E"/>
    </svg>
  ),
  css: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 1h11l-1 11.5L8 14l-4.5-1.5L2.5 1zm8.75 3.5H4.75l.125 1.5h6.25l-.375 3.75L8 10.75h-.025L5.25 9.75l-.125-1.5h1.5l.125.75 1.25.5 1.25-.5.125-1.5H5.125L4.75 6l6.5-.125V4.5z" fill="#264DE4"/>
    </svg>
  ),
  html: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0l1.275 14.4L8 16l5.725-1.6L15 0H1zm11.4 4.8H5.375l.125 1.6h6.775L11.65 12l-3.65 1.075L4.35 12l-.275-2.8h1.6l.125 1.4 2.175.6 2.175-.6.25-2.4H4l-.4-4.8h8.8l-.2 1.6z" fill="#E44D26"/>
    </svg>
  ),
  json: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0v16h16V0H0zm13.25 12c0 .688-.563 1.25-1.25 1.25-.688 0-1.25-.563-1.25-1.25 0-.688.563-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25zM8 13.25c-.688 0-1.25-.563-1.25-1.25 0-.688.563-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25 0 .688-.563 1.25-1.25 1.25zm-3.75-1.5c-.688 0-1.25-.563-1.25-1.25 0-.688.563-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25 0 .688-.563 1.25-1.25 1.25z" fill="#F1E05A"/>
    </svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 1h5l1 2h7v11h-13V1zm-.5 2v10h12V4h-6.5l-1-2h-4.5v1z" fill="#C5C5C5"/>
    </svg>
  ),
  folderOpen: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 1h5l1 2h7v11h-13V1zm-.5 2v10h12V4h-6.5l-1-2h-4.5v1z M1 4v9h12l1-9H1z" fill="#C5C5C5"/>
    </svg>
  ),
  default: (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.85 4.44l-3.28-3.3-.35-.14H2.5l-.5.5v13l.5.5h11l.5-.5V4.8l-.15-.36zM13 14H3V2h7v3.5l.5.5H13v8z" fill="#C5C5C5"/>
    </svg>
  )
};

export function getLanguageIcon(filename: string): JSX.Element {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'ts':
    case 'tsx':
      return LanguageIcons.typescript;
    case 'js':
    case 'jsx':
      return LanguageIcons.javascript;
    case 'css':
      return LanguageIcons.css;
    case 'html':
      return LanguageIcons.html;
    case 'json':
      return LanguageIcons.json;
    default:
      return LanguageIcons.default;
  }
}

export function getFolderIcon(expanded: boolean): JSX.Element {
  return expanded ? LanguageIcons.folderOpen : LanguageIcons.folder;
}