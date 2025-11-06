import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // ❌ base: './', // REMOVE THIS LINE
  plugins: [
    tailwindcss(),
  ],
})