import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  AccessCodeDeleteRequest,
  ActionAttempt,
  ActionType,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseDeleteAccessCodeParams = never
export interface UseDeleteAccessCodeData {
  actionAttempt: ActionAttempt<ActionType>
}
export type UseDeleteAccessCodeMutationParams = AccessCodeDeleteRequest

export function useDeleteAccessCode(): UseMutationResult<
  UseDeleteAccessCodeData,
  SeamError,
  UseDeleteAccessCodeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseDeleteAccessCodeData,
    SeamError,
    AccessCodeDeleteRequest
  >({
    mutationFn: async (mutationParams: UseDeleteAccessCodeMutationParams) => {
      if (client === null) throw new NullSeamClientError()

      return await client.accessCodes.delete(mutationParams)
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries([
        'access_codes',
        'get',
        { access_code_id: variables.access_code_id },
      ])
      void queryClient.invalidateQueries(['access_codes', 'list'])
    },
  })
}
