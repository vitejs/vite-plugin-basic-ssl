import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  externals: ['vite'],
  clean: true,
  declaration: 'compatible',
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'node14.21.3'
    },
    output: {
      generatedCode: {
        reservedNamesAsProps: false
      }
    }
  }
})
