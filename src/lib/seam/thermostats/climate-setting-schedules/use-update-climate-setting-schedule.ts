import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ClimateSettingSchedule,
  ClimateSettingScheduleUpdateRequest,
  ClimateSettingScheduleUpdateResponse,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseUpdateClimateSettingScheduleData = ClimateSettingSchedule
export type UseUpdateClimateSettingScheduleMutationParams =
  ClimateSettingScheduleUpdateRequest

export function useUpdateClimateSettingSchedule(): UseMutationResult<
  UseUpdateClimateSettingScheduleData,
  SeamError,
  UseUpdateClimateSettingScheduleMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    ClimateSettingScheduleUpdateResponse['climate_setting_schedule'],
    SeamError,
    ClimateSettingScheduleUpdateRequest
  >({
    mutationFn: async (
      mutationParams: UseUpdateClimateSettingScheduleMutationParams
    ) => {
      if (client === null) throw new NullSeamClientError()
      return await client.thermostats.climateSettingSchedules.update(
        mutationParams
      )
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries([
        'thermostats',
        'climate_setting_schedules',
        'get',
        { climate_setting_schedule_id: variables.climate_setting_schedule_id },
      ])
      void queryClient.invalidateQueries([
        'thermostats',
        'climate_setting_schedules',
        'list',
      ])
    },
  })
}
