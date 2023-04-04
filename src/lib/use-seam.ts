import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { type Seam } from 'seamapi'

import { seamContext } from 'lib/provider.js'

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
    queryKey: ['seam', 'useClientSession'],
    queryFn: () => {
      // @ts-expect-error Client sessions not yet implemented in SDK.
      client.useClientSession()
    }
  })

  return { client, isLoading, isError, error }
}
