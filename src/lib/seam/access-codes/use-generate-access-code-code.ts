import type {
  AccessCodesGenerateCodeBody,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseGenerateAccessCodeCodeParams = never

export type UseGenerateAccessCodeCodeData = string

export type UseGenerateAccessCodeCodeMutationVariables =
  AccessCodesGenerateCodeBody

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
    mutationFn: async (
      variables: UseGenerateAccessCodeCodeMutationVariables
    ) => {
      if (client === null) throw new NullSeamClientError()
      const { code } = await client.accessCodes.generateCode(variables)
      return code
    },
  })
}
