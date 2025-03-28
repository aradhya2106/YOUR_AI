import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
     header: {
      "Cross-Origin-Embedder-Policy": "require-corp",
"Cross-Origin-Opener":"Policy: same-origin"
     },
     proxy: {
      '/cdn': {
        target: 'http://unpkg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, ''),
  }
     }
     }
})
