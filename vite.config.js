import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' => herhangi bir statik hosting / alt dizinde çalışır (hash tabanlı link sayesinde sunucu gerekmez)
export default defineConfig({
  base: './',
  plugins: [react()],
})
