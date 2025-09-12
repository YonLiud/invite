import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Map '@' to 'src' folder
      '@ui': path.resolve(__dirname, './src/ui'),
      '@auth': path.resolve(__dirname, './src/auth'),
      '@posts': path.resolve(__dirname, './src/posts'),
      '@comments': path.resolve(__dirname, './src/comments'),
      '@likes': path.resolve(__dirname, './src/likes'),
      // Add more aliases as needed
    },
  },
});