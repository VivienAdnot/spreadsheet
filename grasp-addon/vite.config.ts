import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      input: 'frontend/main.ts',
      output: {
        entryFileNames: 'bundle.js',
        chunkFileNames: 'bundle.js',
        assetFileNames: 'bundle.css'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/frontend'
    }
  }
})
