import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['**/node_modules/**', '**/.stryker-tmp/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [{
    name: 'server-only-mock',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'server-only') {
        return '\0virtual:server-only'
      }
    },
    load(id) {
      if (id === '\0virtual:server-only') {
        return 'export default {}'
      }
    },
  }],
})