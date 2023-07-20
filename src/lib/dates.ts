import { DateTime, IANAZone } from 'luxon'

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
 * Get a timezones offset from UTC in minutes.
 *
 * @param timezone
 * @returns minutes
 */
export function getTimezoneOffsetMinutes(timezone: string): number {
  return DateTime.local().setZone(timezone).offset
}

/**
 * Get the timezone offset
 * America/Los_angeles -> -07:00
 *
 * eg. America/Los_Angeles -> UTC-07:00
 *
 * @param timezone
 * @returns offset
 */
export function getTimezoneOffset(timezone: string): string {
  return IANAZone.create(timezone).formatOffset(Date.now(), 'short')
}

export const formatDateReadable = (
  date: string,
  options: {
    showWeekday?: boolean
  } = {}
): string => {
  const { showWeekday = true } = options

  // '2023-04-17' to 'Mon Apr 17, 2023' / 'Apr 17, 2023'
  const format = showWeekday ? 'EEE MMM d, yyyy' : 'MMM d, yyyy'

  return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat(format)
}

export const formatTimeReadable = (time: string): string | null => {
  const dateTime = DateTime.fromFormat(time, 'HH:mm:ss')
  if (!dateTime.isValid) {
    return null
  }

  return dateTime.toFormat('h:mm a')
}

export const formatDateTimeReadable = (dateTime: string): string => {
  const [date = '', time = ''] = dateTime.split('T')
  return `${formatDateReadable(date, { showWeekday: false })} at ${
    formatTimeReadable(time) ?? ''
  }`
}

export const getNow = (): string => formatDateTime(DateTime.now())
export const get24HoursLater = (): string =>
  formatDateTime(DateTime.now().plus({ days: 1 }))

export function formatDateTime(dateTime: DateTime): string {
  const date = dateTime.toFormat('yyyy-MM-dd')
  const time = dateTime.toFormat('HH:mm:ss')
  return `${date}T${time}`
}

/**
 * Takes a date (2023-07-20T00:00:00), and a timezone (America/Los_angeles), and
 * returns an ISO8601 Date (2023-07-20T00:00:00.000-07:00).
 *
 * @param date
 * @param timezone
 * @returns ISOdate
 */
export const createIsoDate = (date: string, timezone: string): string => {
  const offset = getTimezoneOffset(timezone)
  return `${date}.000${offset}`
}
