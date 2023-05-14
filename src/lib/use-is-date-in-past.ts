import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'

import { useInterval } from './use-interval.js'

export function useIsDateInPast(
  date: string | null | undefined
): boolean | null {
  const [isDateInPast, setIsDateInPast] = useState<boolean | null>(null)

  const update = useCallback(() => {
    if (date == null) return
    setIsDateInPast(isInPast(DateTime.fromISO(date)))
  }, [date])

  useEffect(update, [update])
  useInterval(update)

  return isDateInPast
}

const isInPast = (dt: DateTime): boolean | null => {
  if (!dt.isValid) return null
  return dt.diffNow().milliseconds < 0
}
