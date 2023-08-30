import { DateTime, IANAZone, SystemZone } from 'luxon'

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
 * Get the time zone strings supported by the browser.
 *
 * @returns string[]
 */
export function getZoneNames(): string[] {
  return Intl.supportedValuesOf('timeZone')
}

/**
 * Get the default browser time zone.
 */
export function getSystemZone(): string {
  return SystemZone.name
}

/**
 * Takes an IANA time zone, like America/Los_Angeles, into a more readable
 * string: Los Angeles (America).
 */
export function getZoneLabel(zoneName: string): string {
  const [region, city = ''] = zoneName.replace(/_/g, ' ').split('/')
  if (region == null) return city
  if (city == null) return region
  return `${city} (${region})`
}

/**
 * Get a time zones offset from UTC in minutes.
 */
function getZoneOffsetMinutes(zoneName: string): number {
  return DateTime.now().setZone(zoneName).offset
}

/**
 * Compares 2 time zones (America/Los_angeles) by their offset
 * minutes in ascending order.
 */
export const compareByZoneOffsetAsc = (
  zoneNameA: string,
  zoneNameB: string
): number => getZoneOffsetMinutes(zoneNameA) - getZoneOffsetMinutes(zoneNameB)

/**
 * Get the time zone offset
 * America/Los_angeles -> -07:00
 */
export function getZoneOffset(zoneName: string): string {
  return IANAZone.create(zoneName).formatOffset(Date.now(), 'short')
}

const formatDateReadable = (
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

const formatTimeReadable = (time: string): string | null => {
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

export const getNow = (): string => getDateTimeOnly(DateTime.now())
export const get24HoursLater = (): string =>
  getDateTimeOnly(DateTime.now().plus({ days: 1 }))

function getDateTimeOnly(dateTime: DateTime): string {
  const date = dateTime.toFormat('yyyy-MM-dd')
  const time = dateTime.toFormat('HH:mm:ss')
  return `${date}T${time}`
}

/**
 * Takes a date (2023-07-20T00:00:00), and a time zone (America/Los_angeles), and
 * returns an ISO8601 Date (2023-07-20T00:00:00.000-07:00).
 */
export const createIsoDate = (date: string, zoneName: string): string => {
  const offset = getZoneOffset(zoneName)
  return `${date}.000${offset}`
}

/**
 * Takes a ISO datetime string (2023-07-20T00:00:00.000-07:00) and returns
 * the IANA time zone (America/Los_angeles).
 */
export const getZoneNameFromIsoDate = (date: string): string | null =>
  DateTime.fromISO(date).zoneName

/**
 * Takes an ISO datetime string (2023-07-20T00:00:00.000-07:00) and returns a string like
 * (Jul 20, 12:00 AM PDT).
 */
export const formatDateAndTime = (date: string): string =>
  DateTime.fromISO(date).toLocaleString({
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
