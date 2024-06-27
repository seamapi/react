import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  NoiseThresholds,
  NoiseThresholdsListRequest,
  NoiseThresholdsListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseNoiseThresholdsParams = NoiseThresholdsListRequest
export type UseNoiseThresholdsData = NoiseThresholds[]

export function useNoiseThresholds(
  params: UseNoiseThresholdsParams
): UseSeamQueryResult<'noiseThresholds', UseNoiseThresholdsData> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<
    NoiseThresholdsListResponse['noise_thresholds'],
    SeamError
  >({
    enabled: client != null,
    queryKey: ['noise_thresholds', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      const noiseThresholds = await client.noiseThresholds.list(params)
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
