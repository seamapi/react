import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'

import { seamContext } from 'lib/provider.js'
// import { type Seam } from 'seamapi'
import { type Seam } from 'lib/seam-client-stub.js'

export function useSeam(): {
  client: Seam
  isLoading: boolean
  isError: boolean
  error: unknown
} {
  const { client } = useContext(seamContext)

  if (client == null) {
    throw new Error('Must useSeam inside a SeamProvider.')
  }

  const { isLoading, isError, error } = useQuery({
    queryKey: ['useClientSession'],
    queryFn: async () => {
      await client.useClientSession()
    }
  })

  return { client, isLoading, isError, error }
}
