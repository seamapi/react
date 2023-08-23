import { useQuery } from '@tanstack/react-query'
import type {
  ClimateSettingSchedule,
  ClimateSettingScheduleGetRequest,
  ClimateSettingScheduleGetResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseClimateSettingScheduleParams =
  | ClimateSettingScheduleGetRequest
  | string

export type UseClimateSettingScheduleData = ClimateSettingSchedule | null

export function useClimateSettingSchedule(
  params: UseClimateSettingScheduleParams
): UseSeamQueryResult<'climateSettingSchedule', UseClimateSettingScheduleData> {
  const normalizedParams =
    typeof params === 'string'
      ? { climate_setting_schedule_id: params }
      : params
  const { client } = useSeamClient()

  const { data, ...rest } = useQuery<
    ClimateSettingScheduleGetResponse['climate_setting_schedule'] | null,
    SeamError
  >({
    enabled: client != null,
    queryKey: [
      'thermostats',
      'climate_setting_schedules',
      'get',
      normalizedParams,
    ],
    queryFn: async () => {
      if (client == null) return null
      return await client.thermostats.climateSettingSchedules.get(
        normalizedParams
      )
    },
  })

  return { ...rest, climateSettingSchedule: data }
}
