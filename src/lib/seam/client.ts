import { useQuery } from '@tanstack/react-query'
import { type ClientSession, Seam } from 'seamapi'
import { v4 as uuidv4 } from 'uuid'

import { useSeam } from 'lib/SeamProvider.js'

export function useSeamClient(): {
  client: Seam | null
  isLoading: boolean
  isError: boolean
  error: unknown
} {
  const { client, clientOptions, publishableKey, ...context } = useSeam()
  const [clientSession, setClientSession] = useClientSession()
  const userIdentifierKey = useUserIdentifierKey(context.userIdentifierKey)

  const { isLoading, isError, error, data } = useQuery<Seam>({
    queryKey: ['client', { client, clientSession, userIdentifierKey }],
    queryFn: async () => {
      if (client != null) return client

      if (publishableKey == null) {
        throw new Error('Missing publishableKey')
      }

      if (clientSession != null) {
        return new Seam({
          ...clientOptions,
          clientSessionToken: clientSession.token,
        })
      }

      const res = await Seam.getClientSessionToken({
        ...clientOptions,
        publishableKey,
        userIdentifierKey,
      })

      if (!res.ok || res.client_session?.token == null) {
        throw new Error('Failed to get client access token')
      }

      setClientSession(res.client_session)

      return new Seam({
        ...clientOptions,
        clientSessionToken: res.client_session.token,
      })
    },
  })

  return { client: data ?? null, isLoading, isError, error }
}

function useClientSession(): [
  clientSession: ClientSession | null,
  setClientSession: (clientSession: ClientSession) => void
] {
  const localStorageKey = 'seam_client_session'

  const setClientSession = (clientSession: ClientSession): void => {
    globalThis?.localStorage?.setItem(
      localStorageKey,
      JSON.stringify(clientSession)
    )
  }

  const cachedClientSession = globalThis?.localStorage?.getItem(localStorageKey)

  return [
    cachedClientSession != null ? JSON.parse(cachedClientSession) : null,
    setClientSession,
  ]
}

function useUserIdentifierKey(userIdentifierKey: string | undefined): string {
  if (userIdentifierKey != null) {
    return userIdentifierKey
  }

  const localStorageKey = 'seam_user_identifier_key'
  const key = globalThis?.localStorage?.getItem(localStorageKey) ?? uuidv4()
  globalThis?.localStorage?.setItem(localStorageKey, key)
  return key
}
