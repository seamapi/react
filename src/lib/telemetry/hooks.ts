import { useEffect } from 'react'

import type { TelemetryClient } from './client.js'
import { useTelemetryContext } from './TelemetryProvider.js'

export function useTelemetryClient(): TelemetryClient {
  const { client } = useTelemetryContext()
  return client
}

export function useTelemetryOnMount(name: string): void {
  const telemetry = useTelemetryClient()
  useEffect(() => {
    telemetry.screen(name)
  }, [name, telemetry])
}
