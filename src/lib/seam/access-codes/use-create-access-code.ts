import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodeCreateRequest,
  AccessCodeCreateResponse,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

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

  return useMutation<
    AccessCodeCreateResponse['access_code'],
    SeamError,
    AccessCodeCreateRequest
  >({
    mutationFn: async (mutationParams: UseCreateAccessCodeMutationParams) => {
      if (client === null) throw new NullSeamClientError()
      const result = await client.accessCodes.create(mutationParams)
      return result
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['access_codes', 'list'] })
    },
  })
}
