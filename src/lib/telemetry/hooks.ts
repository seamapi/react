import { useEffect } from 'react'

import type { GenericTelemetryClient } from './client.js'
import { useTelemetryContext } from './TelemetryProvider.js'

export function useTelemetryClient(): GenericTelemetryClient {
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
