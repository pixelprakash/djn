import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Vendor code changes far less often than app code — splitting it out
        // lets returning visitors reuse a cached vendor chunk across deploys
        // instead of re-downloading it alongside every app-code change.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          // gsap is intentionally left out — it's only pulled in by the
          // lazy-loaded FlowingMenu component, so Rollup gives it its own
          // async chunk that loads separately from the critical path.
        },
      },
    },
  },
})
