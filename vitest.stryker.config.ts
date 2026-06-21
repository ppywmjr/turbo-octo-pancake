import { defineConfig } from 'vitest/config'

// Vitest config used exclusively by Stryker mutation testing.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['app/**/*.test.{ts,tsx}'],
  },
  resolve: {
    tsconfigPaths: true,
  },
})
