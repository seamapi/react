import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodeGetRequest,
  LockDevice,
  OngoingAccessCode,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseAccessCodeParams = AccessCodeGetRequest | string
export type UseAccessCodeData = AccessCode | null

export interface UseCreateAccessCodeData {
  name: string
  code: string
}

export function useCreateAccessCode(
  device: Pick<LockDevice, 'device_id'>
): UseMutationResult<OngoingAccessCode, SeamError, UseCreateAccessCodeData> {
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
