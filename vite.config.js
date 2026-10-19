import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — tiny, always needed
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // Framer Motion — used on public pages but large, split out
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Lucide icons — used everywhere, moderate size
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Firebase — only used in employee portal
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase';
          }
          // Chart.js — only used in employee portal
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'vendor-charts';
          }
          // Swiper — used in some pages
          if (id.includes('node_modules/swiper')) {
            return 'vendor-swiper';
          }
          // Employee portal source files — only loaded on /employee routes
          if (id.includes('/src/employee/')) {
            return 'employee-portal';
          }
          // Remaining node_modules
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

