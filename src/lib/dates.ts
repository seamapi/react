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

export const compareByTimeZoneOffsetAsc = (
  timeZoneA: string,
  timeZoneB: string
): number =>
  getTimeZoneOffsetMinutes(timeZoneA) - getTimeZoneOffsetMinutes(timeZoneB)

const getTimeZoneOffsetMinutes = (timeZone: string): number =>
  DateTime.now().setZone(timeZone).offset

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
