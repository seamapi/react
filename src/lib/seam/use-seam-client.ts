import { SeamHttp, SeamHttpEndpoints } from '@seamapi/http/connect'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useSeamQueryContext } from './SeamQueryProvider.js'

export function useSeamClient(): {
  client: SeamHttp | null
  endpointClient: SeamHttpEndpoints | null
  isPending: boolean
  isError: boolean
  error: unknown
} {
  const {
    client,
    clientOptions,
    publishableKey,
    clientSessionToken,
    ...context
  } = useSeamQueryContext()
  const userIdentifierKey = useUserIdentifierKeyOrFingerprint(
    clientSessionToken != null ? '' : context.userIdentifierKey
  )

  const { isPending, isError, error, data } = useQuery<
    [SeamHttp, SeamHttpEndpoints]
  >({
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
      if (client != null)
        return [client, SeamHttpEndpoints.fromClient(client.client)]

      if (clientSessionToken != null) {
        const clientSessionTokenClient = SeamHttp.fromClientSessionToken(
          clientSessionToken,
          clientOptions
        )

        return [
          clientSessionTokenClient,
          SeamHttpEndpoints.fromClient(clientSessionTokenClient.client),
        ]
      }

      if (publishableKey == null) {
        throw new Error(
          'Missing either a client, publishableKey, or clientSessionToken'
        )
      }

      const publishableKeyClient = await SeamHttp.fromPublishableKey(
        publishableKey,
        userIdentifierKey,
        clientOptions
      )
      return [
        publishableKeyClient,
        SeamHttpEndpoints.fromClient(publishableKeyClient.client),
      ]
    },
  })

  return {
    client: data?.[0] ?? null,
    endpointClient: data?.[1] ?? null,
    isPending,
    isError,
    error,
  }
}

export class NullSeamClientError extends Error {
  constructor() {
    super(
      [
        'Attempted to use a null Seam client.',
        'Either a hook using useSeamClient was called outside of a SeamProvider or SeamQueryProvider,',
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
    console.warn(`Using an automatically generated fingerprint for the Seam userIdentifierKey!
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
