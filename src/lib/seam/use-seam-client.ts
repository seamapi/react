import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Seam } from 'seamapi'
import { v4 as uuidv4 } from 'uuid'

import { useTelemetryClient } from 'lib/telemetry/index.js'

import { useSeamContext } from 'lib/seam/SeamProvider.js'

export function useSeamClient(): {
  client: Seam | null
  isLoading: boolean
  isError: boolean
  error: unknown
} {
  const telemtry = useTelemetryClient()
  const {
    client,
    clientOptions,
    publishableKey,
    clientSessionToken,
    ...context
  } = useSeamContext()
  const userIdentifierKey = useUserIdentifierKeyOrFingerprint(
    clientSessionToken != null ? '' : context.userIdentifierKey
  )

  const { isLoading, isError, error, data } = useQuery<Seam>({
    queryKey: [
      'client',
      {
        client,
        clientOptions,
        publishableKey,
        userIdentifierKey,
        clientSessionToken,
      },
    ],
    queryFn: async () => {
      if (client != null) return client

      if (clientSessionToken != null) {
        return new Seam({
          ...clientOptions,
          apiKey: undefined,
          clientSessionToken,
        })
      }

      if (publishableKey == null) {
        throw new Error(
          'Missing either a client, publishableKey, or clientSessionToken'
        )
      }

      const res = await Seam.getClientSessionToken({
        ...clientOptions,
        publishableKey,
        userIdentifierKey,
      })

      if (!res.ok || res.client_session?.token == null) {
        throw new Error('Failed to get client session token')
      }

      telemtry.identify(userIdentifierKey, {
        user_identifier_key: userIdentifierKey,
        publishable_key: publishableKey,
      })

      return new Seam({
        ...clientOptions,
        apiKey: undefined,
        clientSessionToken: res.client_session.token,
      })
    },
  })

  return { client: data ?? null, isLoading, isError, error }
}

export class NullSeamClientError extends Error {
  constructor() {
    super(
      [
        'Attempted to use a null Seam client.',
        'Either a hook using useSeamClient was called outside of a SeamProvider,',
        'or there was an error when creating the Seam client in useSeamClient,',
        'or useSeamClient is still loading the client.',
      ].join(' ')
    )
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

function useUserIdentifierKeyOrFingerprint(
  userIdentifierKey: string | undefined
): string {
  useEffect(() => {
    if (userIdentifierKey != null) return
    // eslint-disable-next-line no-console
    console.warn(`Using an automatically generated fingerprint for the SeamProvider userIdentifierKey!
The user interface will show warnings when using a fingerprint.
This is not recommended because the client session is now bound to this machine and is effectively ephemeral.`)
  }, [userIdentifierKey])

  if (userIdentifierKey != null) {
    return userIdentifierKey
  }

  const fingerprint =
    globalThis.localStorage?.getItem('seam_user_fingerprint') ??
    `fingerprint_${uuidv4()}`

  globalThis.localStorage?.setItem('seam_user_fingerprint', fingerprint)

  return fingerprint
}
