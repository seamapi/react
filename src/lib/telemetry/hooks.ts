import { useEffect } from 'react'

import { useClientSession } from 'lib/seam/client-sessions/use-client-session.js'
import { useSeamContext } from 'lib/seam/SeamProvider.js'

import type { TelemetryClient } from './client.js'
import { useTelemetryContext } from './TelemetryProvider.js'

export function useTelemetryClient(): TelemetryClient {
  const { client } = useTelemetryContext()
  return client
}

export function useComponentTelemetry(name: string): void {
  useTelemetryIdentifyUser()
  const telemetry = useTelemetryClient()
  useEffect(() => {
    telemetry.screen(name)
  }, [name, telemetry])
}

export function useTelemetryIdentifyUser(): void {
  const telemetry = useTelemetryClient()
  const { publishableKey } = useSeamContext()
  const { clientSession } = useClientSession()

  useEffect(() => {
    if (clientSession == null) return

    const telemetryUserId = [
      clientSession.workspace_id,
      clientSession.user_identifier_key ?? 'unknown',
    ].join('.')

    telemetry.alias(telemetryUserId)

    telemetry.identify(telemetryUserId, {
      workspace_id: clientSession.workspace_id,
      user_identifier_key: clientSession.user_identifier_key,
      publishable_key: publishableKey,
      connected_account_count: clientSession.connected_account_ids.length,
    })
  }, [clientSession, publishableKey, telemetry])
}
