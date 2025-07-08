import type {
  AccessCodesGenerateCodeParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import { NullSeamClientError, useSeamClient } from '@seamapi/react-query'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

export type UseGenerateAccessCodeCodeParams = never

export type UseGenerateAccessCodeCodeData = string

export type UseGenerateAccessCodeCodeMutationVariables =
  AccessCodesGenerateCodeParams

export function useGenerateAccessCodeCode(): UseMutationResult<
  UseGenerateAccessCodeCodeData,
  SeamHttpApiError,
  UseGenerateAccessCodeCodeMutationVariables
> {
  const { client } = useSeamClient()

  return useMutation<
    UseGenerateAccessCodeCodeData,
    SeamHttpApiError,
    UseGenerateAccessCodeCodeMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      const { code } = await client.accessCodes.generateCode(variables)
      return code
    },
  })
}
