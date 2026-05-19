import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // Admin deploys to /Demo/admin/ on GitHub Pages
  base: process.env.GITHUB_ACTIONS ? '/Demo/admin/' : '/',

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'apollo-vendor': ['@apollo/client', 'graphql'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  server: {
    port: 3001,
    proxy: {
      '/graphql': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
