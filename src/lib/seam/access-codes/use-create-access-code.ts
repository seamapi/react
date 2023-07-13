import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type { AccessCode, AccessCodeCreateRequest, SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCreateAccessCodeParams = never
export type UseCreateAccessCodeData = AccessCode
export type UseCreateAccessCodeMutationParams = AccessCodeCreateRequest

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
