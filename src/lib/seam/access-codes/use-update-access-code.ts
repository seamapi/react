import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodesListResponse,
  AccessCodeUpdateRequest,
  AccessCodeUpdateResponse,
  ActionAttempt,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseUpdateAccessCodeParams = never
export type UseUpdateAccessCodeData = ActionAttempt<'UPDATE_ACCESS_CODE'>
export type UseUpdateAccessCodeMutationParams = AccessCodeUpdateRequest

export function useUpdateAccessCode(): UseMutationResult<
  UseUpdateAccessCodeData,
  SeamError,
  UseUpdateAccessCodeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    AccessCodeUpdateResponse['action_attempt'],
    SeamError,
    AccessCodeUpdateRequest
  >({
    mutationFn: async (mutationParams: UseUpdateAccessCodeMutationParams) => {
      if (client === null) throw new NullSeamClientError()

      await client.accessCodes.update(mutationParams)
    },
    onSuccess: (_data, variables) => {
      // There is no guarantee that the actual code has updated even if the
      // request was succesful. To prevent stale data in the UI, the
      // code below optimistically updates the data in cache.

      queryClient.setQueryData<AccessCode | null>(
        ['access_codes', 'get', { access_code_id: variables.access_code_id }],
        (accessCode) => {
          if (accessCode == null) {
            return
          }

          return {
            ...accessCode,
            code: variables.code ?? accessCode.code,
            name: variables.name ?? accessCode.name,
          }
        }
      )

      queryClient.setQueryData<AccessCodesListResponse['access_codes']>(
        ['access_codes', 'list', { device_id: variables.device_id }],
        (accessCodes) => {
          if (accessCodes == null) {
            return
          }

          return accessCodes.map((accessCode) => {
            if (accessCode.access_code_id === variables.access_code_id) {
              return {
                ...accessCode,
                code: variables.code ?? accessCode.code,
                name: variables.name ?? accessCode.name,
              }
            }

            return accessCode
          })
        }
      )
    },
  })
}
