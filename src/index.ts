import path from 'node:path'
import { promises as fsp } from 'node:fs'
import type { Plugin } from 'vite'

const defaultCacheDir = 'node_modules/.vite'

function viteBasicSslPlugin(): Plugin {
  return {
    name: 'vite:basic-ssl',
    async configResolved(config) {
      const certificate = await getCertificate((config.cacheDir ?? defaultCacheDir) + '/basic-ssl')
      const https = () => ({ cert: certificate, key: certificate })
      config.server.https = Object.assign({}, config.server.https, https())
      config.preview.https = Object.assign({}, config.preview.https, https())
    }
  }
}

export async function getCertificate(cacheDir: string) {
  const cachePath = path.join(cacheDir, '_cert.pem')

  try {
    const [stat, content] = await Promise.all([
      fsp.stat(cachePath),
      fsp.readFile(cachePath, 'utf8')
    ])

    if (Date.now() - stat.ctime.valueOf() > 30 * 24 * 60 * 60 * 1000) {
      throw new Error('cache is outdated.')
    }

    return content
  } catch {
    const content = (await import('./certificate')).createCertificate()
    fsp
      .mkdir(cacheDir, { recursive: true })
      .then(() => fsp.writeFile(cachePath, content))
      .catch(() => {})
    return content
  }
}

export default viteBasicSslPlugin
