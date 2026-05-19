import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Sub-path for GitHub Pages: https://jean31xd.github.io/Demo/
  base: process.env.GITHUB_ACTIONS ? '/Demo/' : '/',

  resolve: {
    alias: {
      // Permite imports como: import Foo from '@/components/Foo'
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Separar vendors en chunks independientes → mejor cache del navegador
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'apollo-vendor': ['@apollo/client', 'graphql'],
        },
      },
    },
    // Alerta si algún chunk supera 500 KB
    chunkSizeWarningLimit: 500,
    // Genera sourcemaps para debugging en demo
    sourcemap: true,
  },

  server: {
    port: 3000,
    // Proxy transparente para evitar CORS en desarrollo local
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
