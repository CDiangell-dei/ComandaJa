import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Caminhos relativos para funcionar em qualquer subpasta do GitHub Pages
  build: {
    outDir: 'docs', // Permite que o GitHub Pages sirva a produção direto da pasta /docs da branch main
  },
  server: {
    port: 3000,
    host: true
  }
})
