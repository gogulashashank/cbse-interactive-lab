import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The optional 3D WebGL book chunk (three.js) is ~646 kB and lazy-loaded only on "/".
    // All 20 interactive notebooks and standalone workbenches are code-split into <150 kB chunks.
    chunkSizeWarningLimit: 700,
  },
})
