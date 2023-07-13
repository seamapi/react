import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type { OngoingAccessCode, SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCreateAccessCodeParams = never
export type UseCreateAccessCodeData = OngoingAccessCode | null
export interface UseCreateAccessCodeMutationParams {
  device_id: string
  name: string
}

export function useCreateAccessCode(): UseMutationResult<
  UseCreateAccessCodeData,
  SeamError,
  UseCreateAccessCodeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (mutationParams) => {
      if (client === null) {
        throw new Error('Missing seam client')
      }

      return await client.accessCodes.create(mutationParams)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(['access_codes', 'list'])
    },
  })
}
