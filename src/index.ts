import path from 'node:path'
import { X509Certificate } from 'node:crypto'
import { promises as fsp } from 'node:fs'
import type { Plugin } from 'vite'

const defaultCacheDir = 'node_modules/.vite'

interface Options {
  certDir: string
  domains: string[]
  name: string
  ttlDays: number
}

function viteBasicSslPlugin(options?: Partial<Options>): Plugin {
  return {
    name: 'vite:basic-ssl',
    async configResolved(config) {
      const certificate = await getCertificate(
        options?.certDir ?? (config.cacheDir ?? defaultCacheDir) + '/basic-ssl',
        options?.name,
        options?.domains,
        options?.ttlDays,
      )
      const https = () => ({ cert: certificate, key: certificate })
      if (config.server.https === undefined || !!config.server.https) {
        config.server.https = Object.assign({}, config.server.https, https())
      }
      if (config.preview.https === undefined || !!config.preview.https) {
        config.preview.https = Object.assign({}, config.preview.https, https())
      }
    },
  }
}

export async function getCertificate(
  cacheDir: string,
  name?: string,
  domains?: string[],
  ttlDays?: number,
) {
  const cachePath = path.join(cacheDir, '_cert.pem')

  try {
    const content = await fsp.readFile(cachePath, 'utf8')
    const cert = new X509Certificate(content);

    // validTo is a nonstandard format, but it successfully parses. validToDate
    // is not available until node 22
    // https://github.com/nodejs/node/issues/52931
    if (Date.now() > Date.parse(cert.validTo)) {
      throw new Error('cache is outdated.');
    }

    return content
  } catch {
    const content = (await import('./certificate')).createCertificate(
      name,
      domains,
      ttlDays,
    )
    fsp
      .mkdir(cacheDir, { recursive: true })
      .then(() => fsp.writeFile(cachePath, content))
      .catch(() => {})
    return content
  }
}

export default viteBasicSslPlugin
