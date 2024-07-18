import type {
  AccessCodesCreateBody,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { AccessCode } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCreateAccessCodeParams = never

export type UseCreateAccessCodeData = AccessCode

export type UseCreateAccessCodeMutationVariables = AccessCodesCreateBody

export function useCreateAccessCode(): UseMutationResult<
  UseCreateAccessCodeData,
  SeamHttpApiError,
  UseCreateAccessCodeMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseCreateAccessCodeData,
    SeamHttpApiError,
    UseCreateAccessCodeMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      return await client.accessCodes.create(variables)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['access_codes', 'get', { access_code_id: data.access_code_id }],
        data
      )
      void queryClient.invalidateQueries({ queryKey: ['access_codes', 'list'] })
    },
  })
}
