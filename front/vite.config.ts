import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/novo-site-instituto/',
  plugins: [
    tailwindcss(),
  ],
})