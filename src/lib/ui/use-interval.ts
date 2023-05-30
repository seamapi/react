import { Duration } from 'luxon'
import { useCallback, useEffect } from 'react'

const defaultDelay = Duration.fromObject({ minutes: 1 }).as('milliseconds')

export function useInterval(
  callback: () => void,
  delay: number = defaultDelay
) {
  const update = useCallback(() => {
    callback()
  }, [callback])

  useEffect(() => {
    const timer = globalThis.setInterval(update, delay)
    return () => {
      globalThis.clearInterval(timer)
    }
  }, [update, delay])
}
