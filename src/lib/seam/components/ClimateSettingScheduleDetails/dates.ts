import { DateTime } from 'luxon'

export const formatDateTime = (date: string): string =>
  DateTime.fromISO(date).toLocaleString({
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
