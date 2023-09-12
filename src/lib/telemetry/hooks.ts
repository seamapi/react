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
    telemetry.track('component_mounted', {
      component_name: name,
      is_custom_element: globalThis.seamCustomElementNames?.length > 0,
    })
  }, [name, telemetry])
}
