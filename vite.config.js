import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path");

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '/@': resolve('src')
    }
  },
  build: {
    outDir: 'dist',
  },
  server: {
    open: false,
    proxy: {
      '/api/v1': {
        target: 'https://xcx.yulue.net',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: ["axios"],
  },
  plugins: [vue()],
})