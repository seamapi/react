import { useEffect, useLayoutEffect } from 'react'

import { useClientSession } from 'lib/seam/client-sessions/use-client-session.js'
import { useSeamContext } from 'lib/seam/SeamProvider.js'

import type { TelemetryClient } from './client.js'
import { useTelemetryContext } from './TelemetryProvider.js'

export function useTelemetryClient(): TelemetryClient {
  const { client } = useTelemetryContext()
  return client
}

export function useComponentTelemetry(name: string): void {
  const { clientSession } = useClientSession()
  const telemetry = useTelemetryClient()
  useEffect(() => {
    // Ensure the client session loaded to avoid anonymous telemetry data.
    if (clientSession == null) return
    telemetry.screen(name)
  }, [name, telemetry, clientSession])
}

export function useUserTelemetry(): void {
  const telemetry = useTelemetryClient()
  const { publishableKey } = useSeamContext()
  const { clientSession } = useClientSession()

  // Ensure identify runs earlier than other effects to avoid anonymous telemetry data.
  useLayoutEffect(() => {
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
    })
  }, [clientSession, publishableKey, telemetry])
}
