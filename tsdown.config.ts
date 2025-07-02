import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/index.ts',
  dts: true,
  minify: false,
  clean: true,
  format: ['cjs', 'esm'],
})