import type { DevicesGetParams, SeamHttpApiError } from '@seamapi/http/connect'
import type { Device } from '@seamapi/types/connect'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceParams = DevicesGetParams

export type UseDeviceData = Device | null

export function useDevice(
  params: UseDeviceParams
): UseSeamQueryResult<'device', UseDeviceData> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<UseDeviceData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['devices', 'get', params],
    queryFn: async () => {
      if (client == null) return null
      return await client.devices.get(params)
    },
  })

  return { ...rest, device: data }
}
