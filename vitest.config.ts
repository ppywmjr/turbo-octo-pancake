import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'tests/helpers/**',
        '**/node_modules/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
})
