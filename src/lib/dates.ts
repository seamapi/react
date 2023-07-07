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
  const [region = '', city = ''] = timezone.replace('_', ' ').split('/')
  return `${city} (${region})`
}
