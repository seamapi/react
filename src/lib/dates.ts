import { DateTime } from 'luxon'

export const compareByCreatedAtDesc = (
  a: { created_at: string },
  b: { created_at: string }
): number => {
  const t1 = DateTime.fromISO(a.created_at)
  const t2 = DateTime.fromISO(b.created_at)
  if (!t1.isValid || !t2.isValid) return 0
  return t1.toMillis() - t2.toMillis()
}

/**
 * Get the timezone strings supported by the user's browser.
 *
 * @returns string[]
 */
export function getTimezones(): string[] {
  return Intl.supportedValuesOf('timeZone')
}

/**
 * Get the default browser timezone.
 *
 * @returns string
 */
export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Takes an IANA timezone, like America/Los_Angeles, into a more readable
 * string: Los Angeles (America).
 * @param timezone
 * @returns string
 */
export function getTimezoneLabel(timezone: string): string {
  const [region = '', city = ''] = timezone.replace(/_/g, ' ').split('/')
  return `${city} (${region})`
}

/**
 * Turns a timezone into a readable UTC offset.
 *
 * eg. America/Los_Angeles -> UTC-07:00
 *
 * @param timezone
 * @returns offset
 */
export function getTimezoneOffsetLabel(timezone: string): string {
  const offset = getTimezoneOffset(timezone) / 60

  const isPositive = offset >= 0

  // Convert fraction to minutes, ie., offset 0.5 to 30 minutes.
  const fraction = parseInt(String(offset * 100).slice(-2)) / 100
  const minutes = fraction !== 0 ? 60 * fraction : 0

  const numDigits = Math.abs(offset) >= 10 ? 2 : 1

  const offsetString = Math.abs(offset).toString()

  // Given an offset like -3.5, we want to turn it into -03:30

  const d0 = numDigits === 2 ? offsetString.charAt(0) : 0
  const d1 = numDigits === 1 ? offsetString.charAt(0) : offsetString.charAt(1)
  const d2 = minutes > 0 ? String(minutes).charAt(0) : 0
  const d3 = minutes > 0 ? String(minutes).charAt(1) : 0

  const sign = isPositive ? '+' : '-'

  return `UTC${sign}${d0}${d1}:${d2}${d3}`
}

/**
 * Get a timezones offset from UTC in minutes.
 *
 * @param timezone
 * @returns minutes
 */
export function getTimezoneOffset(timezone: string): number {
  return DateTime.local().setZone(timezone).offset
}
