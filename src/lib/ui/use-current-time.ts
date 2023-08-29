import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'

import { useInterval } from 'lib/ui/use-interval.js'

export function useCurrentTime(): DateTime | null {
  const [date, setDate] = useState<DateTime | null>(null)

  const update = useCallback(() => {
    setDate(DateTime.now())
  }, [setDate])

  useEffect(update, [update])
  useInterval(update)

  return date
}
