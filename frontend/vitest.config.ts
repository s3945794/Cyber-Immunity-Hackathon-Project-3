import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // Unit tests never consume private application configuration.
  envDir: false,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Playwright owns tests/e2e/** (its own runner, its own test.describe) —
    // Vitest's default *.spec.ts glob would otherwise try to execute those
    // files too and fail with "did not expect test.describe() to be called
    // here".
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/components/ui/**', // shadcn components — not hand-authored
        '**/*.d.ts',
        '**/*.config.*',
        'src/app/**', // pages tested via E2E, not unit tests
      ],
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
