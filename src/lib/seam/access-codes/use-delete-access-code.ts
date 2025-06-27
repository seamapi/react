import type { AccessCodesDeleteParameters } from '@seamapi/http/connect'
import type { AccessCode } from '@seamapi/types/connect'
import { useQueryClient } from '@tanstack/react-query'

import {
  useSeamMutation,
  type UseSeamMutationResult,
} from '../use-seam-mutation.js'

export type UseDeleteAccessCodeParams = never

export type UseDeleteAccessCodeData = undefined

export type UseDeleteAccessCodeMutationVariables = AccessCodesDeleteParameters

export function useDeleteAccessCode(): UseSeamMutationResult<'/access_codes/delete'> {
  const queryClient = useQueryClient()

  return useSeamMutation('/access_codes/delete', {
    onSuccess: (_data, variables) => {
      if (variables == null) return

      void queryClient.invalidateQueries({
        queryKey: [
          'access_codes',
          'get',
          { access_code_id: variables.access_code_id },
        ],
      })
      void queryClient.invalidateQueries({ queryKey: ['access_codes', 'list'] })

      queryClient.setQueryData<AccessCode | null>(
        ['access_codes', 'get', { access_code_id: variables.access_code_id }],
        (accessCode) => {
          if (accessCode == null) {
            return
          }

          return {
            ...accessCode,
            status: 'removing',
          }
        }
      )
    },
  })
}
