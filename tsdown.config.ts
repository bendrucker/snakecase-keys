import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './index.ts',
  dts: true,
  minify: false,
  clean: true,
  format: ['cjs', 'esm'],
})