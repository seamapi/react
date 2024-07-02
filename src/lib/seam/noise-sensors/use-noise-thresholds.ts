import type {
  NoiseSensorsNoiseThresholdsListParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { NoiseThreshold } from '@seamapi/types/connect'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseNoiseThresholdsParams = NoiseSensorsNoiseThresholdsListParams

export type UseNoiseThresholdsData = NoiseThreshold[]

export function useNoiseThresholds(
  params: UseNoiseThresholdsParams
): UseSeamQueryResult<'noiseThresholds', UseNoiseThresholdsData> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<UseNoiseThresholdsData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['noise_thresholds', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      const noiseThresholds =
        await client.noiseSensors.noiseThresholds.list(params)
      for (const noiseThreshold of noiseThresholds) {
        queryClient.setQueryData(
          [
            'noise_thresholds',
            'get',
            { noise_threshold_id: noiseThreshold.noise_threshold_id },
          ],
          noiseThreshold
        )
      }
      return noiseThresholds
    },
  })

  return { ...rest, noiseThresholds: data }
}
