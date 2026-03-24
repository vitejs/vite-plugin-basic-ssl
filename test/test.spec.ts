import { beforeEach, describe, test, expect, vi, Mock } from 'vitest'
import { X509Certificate } from 'node:crypto'
import { createCertificate } from '../src/certificate'
import {
  isCertificateExpired,
  parseNonStandardDateString,
} from '../src/certificate-expiration'

test('create certificate', () => {
  const content = createCertificate()
  expect(content).toMatch(
    /-----BEGIN RSA PRIVATE KEY-----(\n|\r|.)*-----END RSA PRIVATE KEY-----/,
  )
  expect(content).toMatch(
    /-----BEGIN CERTIFICATE-----(\n|\r|.)*-----END CERTIFICATE-----/,
  )
})

describe('isCertificateExpired', () => {
  let validToDateMock: Mock
  let validToMock: Mock

  beforeEach(() => {
    validToDateMock = vi.spyOn(X509Certificate.prototype, 'validToDate', 'get')
    validToMock = vi.spyOn(X509Certificate.prototype, 'validTo', 'get')
  })

  describe('with validToDate', () => {
    test('returns false', () => {
      validToDateMock.mockReturnValue(new Date(Date.now() + 10000))

      const content = createCertificate()
      const isExpired = isCertificateExpired(content)
      expect(isExpired).toBe(false)
    })

    test('returns true', () => {
      validToDateMock.mockReturnValue(new Date(Date.now() - 10000))

      const content = createCertificate()
      const isExpired = isCertificateExpired(content)
      expect(isExpired).toBe(true)
    })
  })

  describe('with validTo', () => {
    test('returns false', () => {
      validToDateMock.mockReturnValue(undefined)
      validToMock.mockReturnValue('Sep  3 21:40:37 2296 GMT')

      const content = createCertificate()
      const isExpired = isCertificateExpired(content)
      expect(isExpired).toBe(false)
    })

    test('returns true', () => {
      validToDateMock.mockReturnValue(undefined)
      validToMock.mockReturnValue('Jan 22 08:20:44 2022 GMT')

      const content = createCertificate()
      const isExpired = isCertificateExpired(content)
      expect(isExpired).toBe(true)
    })
  })
})

test('parseNonStandardDateString', () => {
  const content = createCertificate()
  const cert = new X509Certificate(content)
  const date = parseNonStandardDateString(cert.validTo)
  expect(date).toBeInstanceOf(Date)
  expect(date.getTime()).toBeGreaterThan(0)
  if (cert.validToDate) {
    expect(date.getTime()).toBe(cert.validToDate.getTime())
  }
})
