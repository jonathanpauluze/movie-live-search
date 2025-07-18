import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'src/main.ts'],
      include: [
        'src/components/**/*.{tsx,ts}',
        'src/hooks/**/*.{tsx,ts}',
        'src/utils/**/*.{tsx,ts}',
        'src/pages/**/*.{tsx,ts}'
      ]
    }
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(dirname, './src')
      }
    ]
  }
})
