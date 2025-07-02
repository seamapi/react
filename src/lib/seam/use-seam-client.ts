import {
  SeamHttp,
  SeamHttpEndpoints,
  SeamHttpEndpointsWithoutWorkspace,
  SeamHttpWithoutWorkspace,
} from '@seamapi/http/connect'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useSeamQueryContext } from './SeamQueryProvider.js'

export function useSeamClient(): {
  client: SeamHttp | null
  endpointClient: SeamHttpEndpoints | null
  clientWithoutWorkspace: SeamHttpWithoutWorkspace | null
  endpointClientWithoutWorkspace: SeamHttpEndpointsWithoutWorkspace | null
  queryKeyPrefixes: string[]
  isPending: boolean
  isError: boolean
  error: unknown
} {
  const {
    client,
    clientOptions,
    publishableKey,
    clientSessionToken,
    consoleSessionToken,
    workspaceId,
    queryKeyPrefix,
    ...context
  } = useSeamQueryContext()
  const userIdentifierKey = useUserIdentifierKeyOrFingerprint(
    clientSessionToken != null ? '' : context.userIdentifierKey
  )

  const { isPending, isError, error, data } = useQuery<{
    client: SeamHttp | null
    endpointClient: SeamHttpEndpoints | null
    clientWithoutWorkspace: SeamHttpWithoutWorkspace | null
    endpointClientWithoutWorkspace: SeamHttpEndpointsWithoutWorkspace | null
  }>({
    queryKey: [
      ...getQueryKeyPrefixes({ queryKeyPrefix }),
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
        return {
          client,
          endpointClient: SeamHttpEndpoints.fromClient(client.client),
          clientWithoutWorkspace: null,
          endpointClientWithoutWorkspace: null,
        }

      if (clientSessionToken != null) {
        const seam = SeamHttp.fromClientSessionToken(
          clientSessionToken,
          clientOptions
        )

        return {
          client: seam,
          endpointClient: SeamHttpEndpoints.fromClient(seam.client),
          clientWithoutWorkspace: null,
          endpointClientWithoutWorkspace: null,
        }
      }

      if (publishableKey != null) {
        const seam = await SeamHttp.fromPublishableKey(
          publishableKey,
          userIdentifierKey,
          clientOptions
        )

        return {
          client: seam,
          endpointClient: SeamHttpEndpoints.fromClient(seam.client),
          clientWithoutWorkspace: null,
          endpointClientWithoutWorkspace: null,
        }
      }

      if (consoleSessionToken != null) {
        const clientWithoutWorkspace =
          SeamHttpWithoutWorkspace.fromConsoleSessionToken(consoleSessionToken)

        const endpointClientWithoutWorkspace =
          SeamHttpEndpointsWithoutWorkspace.fromClient(
            clientWithoutWorkspace.client
          )

        if (workspaceId == null) {
          return {
            client: null,
            endpointClient: null,
            clientWithoutWorkspace,
            endpointClientWithoutWorkspace,
          }
        }

        const seam = SeamHttp.fromConsoleSessionToken(
          consoleSessionToken,
          workspaceId,
          clientOptions
        )

        return {
          client: seam,
          endpointClient: SeamHttpEndpoints.fromClient(seam.client),
          clientWithoutWorkspace,
          endpointClientWithoutWorkspace,
        }
      }

      throw new Error(
        'Missing either a client, publishableKey, clientSessionToken, or consoleSessionToken.'
      )
    },
  })

  return {
    client: data?.client ?? null,
    endpointClient: data?.endpointClient ?? null,
    clientWithoutWorkspace: data?.clientWithoutWorkspace ?? null,
    endpointClientWithoutWorkspace:
      data?.endpointClientWithoutWorkspace ?? null,
    queryKeyPrefixes: getQueryKeyPrefixes({
      queryKeyPrefix,
      userIdentifierKey,
      publishableKey,
      clientSessionToken,
      consoleSessionToken,
      workspaceId,
    }),
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

const getQueryKeyPrefixes = ({
  queryKeyPrefix,
  userIdentifierKey,
  publishableKey,
  clientSessionToken,
  consoleSessionToken,
  workspaceId,
}: {
  queryKeyPrefix: string | undefined
  userIdentifierKey?: string
  publishableKey?: string | undefined
  clientSessionToken?: string | undefined
  consoleSessionToken?: string | undefined
  workspaceId?: string | undefined
}): string[] => {
  const seamPrefix = 'seam'

  if (queryKeyPrefix != null) return [seamPrefix, queryKeyPrefix]

  if (clientSessionToken != null) {
    return [seamPrefix, clientSessionToken]
  }

  if (publishableKey != null && userIdentifierKey != null) {
    return [seamPrefix, publishableKey, userIdentifierKey]
  }

  if (consoleSessionToken != null) {
    if (workspaceId != null) {
      return [seamPrefix, consoleSessionToken, workspaceId]
    }

    return [seamPrefix, consoleSessionToken, 'without_workspace']
  }

  return [seamPrefix]
}
