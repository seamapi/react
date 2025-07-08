import type {
  AccessCodesUpdateBody,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import { NullSeamClientError, useSeamClient } from '@seamapi/react-query'
import type { AccessCode } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

export type UseUpdateAccessCodeParams = never

export type UseUpdateAccessCodeData = undefined

export type UseUpdateAccessCodeMutationVariables = Pick<
  AccessCodesUpdateBody,
  | 'device_id'
  | 'access_code_id'
  | 'code'
  | 'name'
  | 'starts_at'
  | 'ends_at'
  | 'type'
>

export function useUpdateAccessCode(): UseMutationResult<
  UseUpdateAccessCodeData,
  SeamHttpApiError,
  UseUpdateAccessCodeMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateAccessCodeData,
    SeamHttpApiError,
    UseUpdateAccessCodeMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.accessCodes.update(variables)
    },
    onSuccess: (_data, variables) => {
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
            starts_at: variables.starts_at ?? accessCode.starts_at,
            ends_at: variables.ends_at ?? accessCode.ends_at,
            type: variables.type ?? accessCode.type,
            status: 'setting',
          }
        }
      )

      queryClient.setQueryData<AccessCode[]>(
        ['access_codes', 'list'],
        (accessCodes) => {
          if (accessCodes == null) {
            return accessCodes
          }

          return accessCodes.map((accessCode) => {
            if (accessCode.access_code_id === variables.access_code_id) {
              return {
                ...accessCode,
                code: variables.code ?? accessCode.code,
                name: variables.name ?? accessCode.name,
                status: 'setting',
              }
            }

            return accessCode
          })
        }
      )
    },
  })
}
