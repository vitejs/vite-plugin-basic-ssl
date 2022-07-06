import type puppeteer from 'puppeteer'
import { beforeAll, afterAll, describe, test, expect } from 'vitest'
import {
  expectByPolling,
  getComputedColor,
  getEl,
  getText,
  killServer,
  postTest,
  preTest,
  startServer,
  updateFile
} from './util'

beforeAll(async () => {
  await preTest()
})

afterAll(postTest)

describe('vite-plugin-basic-ssl', () => {
  describe('dev', () => {
    declareTests(false)
  })

  describe('build', () => {
    declareTests(true)
  })
})

export function declareTests(isBuild: boolean) {
  let page: puppeteer.Page = undefined!

  beforeAll(async () => {
    page = await startServer(isBuild)
  })

  afterAll(async () => {
    await killServer()
  })

  test('smoke dev test', async () => {
    const el = await page.$('.script-setup')
    expect(el).not.toBeNull()
  })
}
