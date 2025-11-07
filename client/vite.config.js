import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- "ЧОТКИЙ" ФІКС (ДОДАЙ/ЗАМІНИ ЦЕЙ "БЛОК") ---
  test: {
    globals: true, // "Чотко" "кажемо", що 'describe' і 'it' - "глобальні"
    environment: 'jsdom', // "Чотко" "імітуємо" "браузер"
    setupFiles: './src/setupTests.js', // "Чоткий" "файл" "налаштувань"
  },
  // --- КІНЕЦЬ ФІКСУ ---
})