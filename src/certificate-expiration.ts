import { X509Certificate } from 'node:crypto'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function isCertificateExpired(content: string): boolean {
  const cert = new X509Certificate(content)
  const expirationDate = getCertificateExpirationDate(cert)
  return new Date() > expirationDate
}

function getCertificateExpirationDate(cert: X509Certificate): Date {
  // validToDate is not available until node 22
  if (cert.validToDate) {
    return cert.validToDate
  }

  return parseNonStandardDateString(cert.validTo)
}

// validTo is a nonstandard format: %s %2d %02d:%02d:%02d %d%s GMT
// https://github.com/nodejs/node/issues/52931
export function parseNonStandardDateString(str: string): Date {
  const [month, day, time, year] = str.split(' ').filter((part) => !!part)
  // convert string month to number
  const monthIndex = MONTHS.indexOf(month) + 1
  return new Date(
    `${year}-${monthIndex.toString().padStart(2, '0')}-${day.padStart(2, '0')}T${time}Z`,
  )
}
