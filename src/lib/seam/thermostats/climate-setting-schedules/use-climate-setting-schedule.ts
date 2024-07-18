import type {
  SeamHttpApiError,
  ThermostatsClimateSettingSchedulesGetParams,
} from '@seamapi/http/connect'
import type { ClimateSettingSchedule } from '@seamapi/types/connect'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseClimateSettingScheduleParams =
  ThermostatsClimateSettingSchedulesGetParams

export type UseClimateSettingScheduleData = ClimateSettingSchedule | null

export function useClimateSettingSchedule(
  params: UseClimateSettingScheduleParams
): UseSeamQueryResult<'climateSettingSchedule', UseClimateSettingScheduleData> {
  const { client } = useSeamClient()

  const { data, ...rest } = useQuery<
    UseClimateSettingScheduleData,
    SeamHttpApiError
  >({
    enabled: client != null,
    queryKey: ['thermostats', 'climate_setting_schedules', 'get', params],
    queryFn: async () => {
      if (client == null) return null
      return await client.thermostats.climateSettingSchedules.get(params)
    },
  })

  return { ...rest, climateSettingSchedule: data }
}
