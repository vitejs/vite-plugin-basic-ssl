import { test, expect } from 'vitest'
import { createCertificate } from '../src/certificate'

test('create certificate', () => {
  const content = createCertificate()
  expect(content).toMatch(/-----BEGIN RSA PRIVATE KEY-----(\n|\r|.)*-----END RSA PRIVATE KEY-----/)
  expect(content).toMatch(/-----BEGIN CERTIFICATE-----(\n|\r|.)*-----END CERTIFICATE-----/)
})