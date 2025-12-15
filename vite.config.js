 // vite.config.js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    root: '.',
    base: process.env.NODE_ENV === 'production' ? '/magic-english-poster-generator/' : '/',
    publicDir: 'public',
    plugins: [react({
      include: /\.(js|jsx|ts|tsx)$/,
    })],
    server: {
      port: 3000,
      open: true,
      host: true,
      historyApiFallback: true,
      fs: {
        strict: false
      }
    },
  })