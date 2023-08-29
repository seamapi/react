import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'

import { useInterval } from 'lib/ui/use-interval.js'

export function useCurrentTime(): DateTime {
  const [date, setDate] = useState<DateTime>(DateTime.now())

  const update = useCallback(() => {
    setDate(DateTime.now())
  }, [setDate])

  useInterval(update)

  return date
}
