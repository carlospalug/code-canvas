import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    Buffer: ['buffer', 'Buffer'],
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          monaco: ['@monaco-editor/react']
        }
      },
      // Properly exclude the problematic file
      onwarn(warning, warn) {
        // Suppress specific warnings from monaco-editor
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.includes('monaco-editor')) {
          return;
        }
        if (warning.message.includes('vs/basic-languages/mysql/mysql.js')) {
          return;
        }
        warn(warning);
      },
      external: (id) => id.includes('vs/basic-languages/mysql/mysql.js')
    }
  },
  server: {
    host: true,
    port: 3000,
  },
});