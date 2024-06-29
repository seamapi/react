import type {
  AccessCodesGenerateCodeBody,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseGenerateAccessCodeCodeParams = never

export type UseGenerateAccessCodeCodeData = string

export type UseGenerateAccessCodeCodeMutationParams =
  AccessCodesGenerateCodeBody

export function useGenerateAccessCodeCode(): UseMutationResult<
  UseGenerateAccessCodeCodeData,
  SeamHttpApiError,
  UseGenerateAccessCodeCodeMutationParams
> {
  const { client } = useSeamClient()

  return useMutation<
    UseGenerateAccessCodeCodeData,
    SeamHttpApiError,
    UseGenerateAccessCodeCodeMutationParams
  >({
    mutationFn: async (
      mutationParams: UseGenerateAccessCodeCodeMutationParams
    ) => {
      if (client === null) throw new NullSeamClientError()
      const { code } = await client.accessCodes.generateCode(mutationParams)
      return code
    },
  })
}
