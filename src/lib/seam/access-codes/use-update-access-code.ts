import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  AccessCodeUpdateRequest,
  AccessCodeUpdateResponse,
  ActionAttempt,
  SeamAPIError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseUpdateAccessCodeParams = never
export type UseUpdateAccessCodeData = ActionAttempt<'UPDATE_ACCESS_CODE'>
export type UseUpdateAccessCodeMutationParams = AccessCodeUpdateRequest

export function useUpdateAccessCode(): UseMutationResult<
  UseUpdateAccessCodeData,
  SeamAPIError,
  UseUpdateAccessCodeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    AccessCodeUpdateResponse['action_attempt'],
    SeamAPIError,
    AccessCodeUpdateRequest
  >({
    mutationFn: async (mutationParams: UseUpdateAccessCodeMutationParams) => {
      if (client === null) throw new NullSeamClientError()

      return await client.accessCodes.update(mutationParams)
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
