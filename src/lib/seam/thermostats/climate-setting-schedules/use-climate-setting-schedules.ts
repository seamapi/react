import type {
  SeamHttpApiError,
  ThermostatsClimateSettingSchedulesListParams,
} from '@seamapi/http/connect'
import type { ClimateSettingSchedule } from '@seamapi/types/connect'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseClimateSettingSchedulesParams =
  ThermostatsClimateSettingSchedulesListParams

export type UseClimateSettingSchedulesData = ClimateSettingSchedule[]

export function useClimateSettingSchedules(
  params: UseClimateSettingSchedulesParams
): UseSeamQueryResult<
  'climateSettingSchedules',
  UseClimateSettingSchedulesData
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<
    UseClimateSettingSchedulesData,
    SeamHttpApiError
  >({
    enabled: client != null,
    queryKey: ['thermostats', 'climate_setting_schedules', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      const climateSettingSchedules =
        await client.thermostats.climateSettingSchedules.list(params)
      for (const schedule of climateSettingSchedules) {
        queryClient.setQueryData(
          [
            'thermostats',
            'climate_setting_schedules',
            'get',
            {
              climate_setting_schedule_id: schedule.climate_setting_schedule_id,
            },
          ],
          schedule
        )
      }
      return climateSettingSchedules
    },
  })

  return { ...rest, climateSettingSchedules: data }
}
