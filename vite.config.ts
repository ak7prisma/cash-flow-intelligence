/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }
          if (
            id.includes('framer-motion') || 
            id.includes('react-icons') || 
            id.includes('chart.js') ||
            id.includes('react-chartjs-2')
          ) {
            return 'vendor-ui';
          }
        }
      }
    }
  },
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
})
