import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Seam } from 'seamapi'

import { seamContext } from 'lib/provider.js'

export function useSeam(): {
  client: Seam | null
  isLoading: boolean
  isError: boolean
  error: unknown
} {
  const { client, clientOptions, publishableKey, userIdentifierKey } =
    useContext(seamContext)

  const { isLoading, isError, error, data } = useQuery<Seam>({
    queryKey: ['client'],
    queryFn: async () => {
      if (client != null) return client

      if (publishableKey == null) {
        throw new Error('Missing publishableKey')
      }

      const res = await Seam.getClientSessionToken({
        ...clientOptions,
        publishableKey,
        userIdentifierKey
      })

      if (!res.ok || res.client_session?.token == null) {
        throw new Error('Failed to get client access token')
      }

      return new Seam({
        ...clientOptions,
        clientSessionToken: res.client_session.token
      })
    }
  })

  return { client: data ?? null, isLoading, isError, error }
}
