import type { GenericTelemetryClient } from './client.js'
import { useTelemetryContext } from './TelemetryProvider.js'

export function useTelemetryClient(): GenericTelemetryClient {
  const { client } = useTelemetryContext()
  return client
}
