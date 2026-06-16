import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    // postprocessing excluded from esbuild pre-bundling to avoid
    // dynamic import issues inside the postprocessing library.
    exclude: ['@react-three/postprocessing', 'postprocessing'],
    esbuildOptions: {
      sourcemap: false,
    },
  },
})
