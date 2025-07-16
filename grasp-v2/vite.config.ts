import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'frontend/dist',
    rollupOptions: {
      input: 'frontend/main.ts',
      output: {
        entryFileNames: 'bundle.js',
        chunkFileNames: 'bundle.js',
        assetFileNames: 'bundle.css',
        inlineDynamicImports: true
      }
    },
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@': '/frontend'
    }
  }
})
