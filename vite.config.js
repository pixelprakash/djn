import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Preload the latin subsets of the two body/headline fonts so text paints in the
// right typeface straight away (their hashed names are only known at build).
const fontPreload = () => ({
  name: 'font-preload',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      if (!ctx.bundle) return html
      const want = [/dm-sans-latin-wght-normal/, /literata-latin-wght-normal/]
      const tags = Object.keys(ctx.bundle)
        .filter(f => f.endsWith('.woff2') && want.some(r => r.test(f)))
        .map(f => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: '/' + f },
          injectTo: 'head-prepend',
        }))
      return { html, tags }
    },
  },
})

export default defineConfig({
  plugins: [react(), fontPreload()],
  build: {
    rollupOptions: {
      output: {
        // Vendor code changes far less often than app code — splitting it out
        // lets returning visitors reuse a cached vendor chunk across deploys
        // instead of re-downloading it alongside every app-code change.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // gsap is intentionally left out — it's only pulled in by the
          // lazy-loaded FlowingMenu component, so Rollup gives it its own
          // async chunk that loads separately from the critical path.
        },
      },
    },
  },
})
