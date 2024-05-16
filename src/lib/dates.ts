import { DateTime } from 'luxon'

const ABBREVIATED_DATE_FORMAT = 'MMM d, yyyy'
const TIME_FORMAT = 'h:mm a'

export const compareByCreatedAtDesc = (
  a: { created_at: string },
  b: { created_at: string }
): number => {
  const t1 = DateTime.fromISO(a.created_at)
  const t2 = DateTime.fromISO(b.created_at)
  if (!t1.isValid || !t2.isValid) return 0
  return t1.toMillis() - t2.toMillis()
}

export const getSupportedTimeZones = (): string[] => {
  const timeZones = new Set(Intl.supportedValuesOf('timeZone'))
  timeZones.add('UTC')
  return Array.from(timeZones).sort()
}

export const getSystemTimeZone = (): string => DateTime.now().zoneName ?? 'UTC'

export const formatTimeZone = (timeZone: string): string => {
  const offset = DateTime.now().setZone(timeZone).toFormat("'UTC'Z")
  return `${timeZone.replaceAll('_', ' ')} (${offset})`
}

export const formatTime = (time: string): string => {
  const dateTime = DateTime.fromISO(time)
  return dateTime.isValid ? dateTime.toLocaleString(DateTime.TIME_SIMPLE) : ''
}

export const serializeDateTimePickerValue = (
  dateTime: DateTime,
  timeZone: string
): string | null => {
  if (!dateTime.isValid) {
    return null
  }

  return dateTime.setZone(timeZone).toFormat("yyyy-MM-dd'T'HH:mm:ss")
}

export const parseDateTimePickerValue = (
  value: string,
  timeZone: string
): DateTime =>
  DateTime.fromISO(value).setZone(timeZone, { keepLocalTime: true })

/**
 * Formats a date time string to an object with date and time properties.
 */
export const formatDateTime = (
  dateTime: string,
  options?: {
    dateFormat?: string
    timeFormat?: string
  }
): { date: string; time: string } => {
  const date = DateTime.fromISO(dateTime).toFormat(options?.dateFormat ?? ABBREVIATED_DATE_FORMAT)
  const time = DateTime.fromISO(dateTime).toFormat(options?.timeFormat ?? TIME_FORMAT)
  return { date, time }
}
