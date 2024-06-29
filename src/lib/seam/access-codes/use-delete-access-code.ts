import type {
  AccessCodesDeleteParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseDeleteAccessCodeParams = never

export type UseDeleteAccessCodeData = undefined

export type UseDeleteAccessCodeMutationParams = AccessCodesDeleteParams

export function useDeleteAccessCode(): UseMutationResult<
  UseDeleteAccessCodeData,
  SeamHttpApiError,
  UseDeleteAccessCodeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseDeleteAccessCodeData,
    SeamHttpApiError,
    UseDeleteAccessCodeMutationParams
  >({
    mutationFn: async (mutationParams: UseDeleteAccessCodeMutationParams) => {
      if (client === null) throw new NullSeamClientError()
      await client.accessCodes.delete(mutationParams)
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [
          'access_codes',
          'get',
          { access_code_id: variables.access_code_id },
        ],
      })
      void queryClient.invalidateQueries({ queryKey: ['access_codes', 'list'] })
    },
  })
}
