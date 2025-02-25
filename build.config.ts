import fs from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  externals: ['vite'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
    },
    output: {
      generatedCode: {
        reservedNamesAsProps: false,
      },
    },
  },
  hooks: {
    async 'build:done'(ctx) {
      // Remove duplicated `dist/chunks/certificate.{cjs,mjs}` chunks
      // as both are only dynamically imported by the entrypoints. The
      // dynamic import can use the `.mjs` chunk only instead.
      await fs.rm('dist/chunks/certificate.cjs')
      const indexCjs = await fs.readFile('dist/index.cjs', 'utf8')
      const editedIndexCjs = indexCjs.replace(
        'chunks/certificate.cjs',
        'chunks/certificate.mjs',
      )
      if (indexCjs === editedIndexCjs) {
        throw new Error(
          'Failed to find `dist/chunks/certificate.cjs` in `dist/index.cjs`',
        )
      }
      await fs.writeFile('dist/index.cjs', editedIndexCjs)
    },
  },
})
