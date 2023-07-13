import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type { LockDevice, OngoingAccessCode, SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export interface UseCreateAccessCodeParams {
  device: Pick<LockDevice, 'device_id'>
}

export type UseCreateAccessCodeData = OngoingAccessCode | null
export interface UseCreateAccessCodeMutationParams {
  name: string
  code: string
}

export function useCreateAccessCode({
  device,
}: UseCreateAccessCodeParams): UseMutationResult<
  UseCreateAccessCodeData,
  SeamError,
  UseCreateAccessCodeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      if (client === null) {
        throw new Error('Missing seam client')
      }

      return await client.accessCodes.create({
        device_id: device.device_id,
        name: data.name,
        code: data.code,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(['access_codes', 'list'])
    },
  })
}
