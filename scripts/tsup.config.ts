import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['openapi.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
