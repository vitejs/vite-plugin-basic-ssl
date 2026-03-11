import path from 'node:path'
import { promises as fsp } from 'node:fs'
import type { Plugin } from 'vite'

// @ts-ignore
import forge from 'node-forge/lib/forge'
import 'node-forge/lib/pki'

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
    const content = await fsp.readFile(cachePath, "utf8")
    const certContent = content.match(
      /-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----/,
    )
    if (!certContent) {
      throw new Error("certificate not detected.")
    }

    const cert = forge.pki.certificateFromPem(certContent[0])

    if (new Date() > cert.validity.notAfter) {
      throw new Error("cache is outdated.")
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
