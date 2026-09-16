import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Permite rodar perfeitamente no GitHub Pages e localmente sem problemas de rotas estáticas
  server: {
    port: 3000,
    host: true
  }
})
