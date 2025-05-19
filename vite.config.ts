import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      'lucide-react',
      'node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql.js'
    ],
    esbuildOptions: {
      // Other esbuild options can go here if needed
    }
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
      // Exclude problematic files from the build
      external: [
        'node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql.js'
      ]
    }
  },
  server: {
    host: true,
    port: 3000,
  },
});