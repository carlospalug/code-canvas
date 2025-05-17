import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import App from './App.tsx';
import './index.css';

// Initialize Capacitor plugins
if (Capacitor.isNativePlatform()) {
  StatusBar.setBackgroundColor({ color: '#1f2937' });
}

// Create root and render app
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);