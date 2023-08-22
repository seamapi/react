import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ClimateSettingSchedule,
  ClimateSettingSchedulesListRequest,
  ClimateSettingSchedulesListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseClimateSettingSchedulesParams =
  ClimateSettingSchedulesListRequest
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
    ClimateSettingSchedulesListResponse['climate_setting_schedules'],
    SeamError
  >({
    enabled: client != null,
    queryKey: ['thermostats', 'climate_setting_schedules', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      return await client.thermostats.climateSettingSchedules.list(params)
    },
    onSuccess: (schedules) => {
      // Prime cache for each schedule.
      for (const schedule of schedules) {
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
    },
  })

  return { ...rest, climateSettingSchedules: data }
}
