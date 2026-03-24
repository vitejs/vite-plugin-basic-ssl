import fs from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'
import colors from 'picocolors'

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
      const isBuild = ctx.options.stub === false
      if (isBuild) {
        await dedupeCertificateChunk()
        await patchCJS()
      }
    },
  },
})

// Remove duplicated `dist/chunks/certificate.{cjs,mjs}` chunks
// as both are only dynamically imported by the entrypoints. The
// dynamic import can use the `.mjs` chunk only instead.
async function dedupeCertificateChunk() {
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
}

/**

It converts

```ts
exports["default"] = viteBasicSslPlugin;
```

to

```ts
module.exports = viteBasicSslPlugin;
module.exports["default"] = viteBasicSslPlugin;
```
*/
async function patchCJS() {
  const indexPath = 'dist/index.cjs'
  let code = await fs.readFile(indexPath, 'utf-8')

  const matchMixed = code.match(/\nexports\["default"\] = (\w+);/)
  if (matchMixed) {
    const name = matchMixed[1]

    const lines = code.trimEnd().split('\n')

    // search from the end to prepend `modules.` to `export[xxx]`
    for (let i = lines.length - 1; i > 0; i--) {
      if (lines[i].startsWith('exports')) lines[i] = 'module.' + lines[i]
      else {
        // at the beginning of exports, export the default function
        lines[i] += `\nmodule.exports = ${name};`
        break
      }
    }

    await fs.writeFile(indexPath, lines.join('\n'))

    console.log(colors.bold(`${indexPath} CJS patched`))
  } else {
    const matchDefault = code.match(/\nmodule.exports = (\w+);/)

    if (matchDefault) {
      code += `module.exports["default"] = ${matchDefault[1]};\n`
      await fs.writeFile(indexPath, code)
      console.log(colors.bold(`${indexPath} CJS patched`))
    } else {
      console.error(colors.red(`${indexPath} CJS patch failed`))
      process.exit(1)
    }
  }
}
