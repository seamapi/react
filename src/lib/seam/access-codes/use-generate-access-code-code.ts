import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodeGenerateCodeRequest,
  AccessCodeGenerateCodeResponse,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseGenerateAccessCodeCodeParams = never
export type UseGenerateAccessCodeCodeData = Pick<
  AccessCode,
  'code' | 'device_id'
>
export type UseGenerateAccessCodeCodeMutationParams =
  AccessCodeGenerateCodeRequest

export function useGenerateAccessCodeCode(): UseMutationResult<
  UseGenerateAccessCodeCodeData,
  SeamError,
  UseGenerateAccessCodeCodeMutationParams
> {
  const { client } = useSeamClient()

  return useMutation<
    AccessCodeGenerateCodeResponse['generated_code'],
    SeamError,
    AccessCodeGenerateCodeRequest
  >({
    mutationFn: async (
      mutationParams: UseGenerateAccessCodeCodeMutationParams
    ) => {
      if (client === null) throw new NullSeamClientError()
      const result = await client.accessCodes.generateCode(mutationParams)
      return result
    },
  })
}
