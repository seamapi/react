import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodeCreateRequest,
  AccessCodeCreateResponse,
  SeamAPIError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCreateAccessCodeParams = never
export type UseCreateAccessCodeData = AccessCode
export type UseCreateAccessCodeMutationParams = AccessCodeCreateRequest

export function useCreateAccessCode(): UseMutationResult<
  UseCreateAccessCodeData,
  SeamAPIError,
  UseCreateAccessCodeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    AccessCodeCreateResponse['access_code'],
    SeamAPIError,
    AccessCodeCreateRequest
  >({
    mutationFn: async (mutationParams: UseCreateAccessCodeMutationParams) => {
      if (client === null) throw new NullSeamClientError()
      return await client.accessCodes.create(mutationParams)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(['access_codes', 'list'])
    },
  })
}
