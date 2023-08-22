import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type { ClimateSettingScheduleDeleteRequest, SeamError } from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseDeleteClimateSettingScheduleData = {}
export type UseDeleteClimateSettingScheduleMutationParams =
  ClimateSettingScheduleDeleteRequest

export function useDeleteClimateSettingSchedule(): UseMutationResult<
  UseDeleteClimateSettingScheduleData,
  SeamError,
  UseDeleteClimateSettingScheduleMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseDeleteClimateSettingScheduleData,
    SeamError,
    ClimateSettingScheduleDeleteRequest
  >({
    mutationFn: async (
      mutationParams: UseDeleteClimateSettingScheduleMutationParams
    ) => {
      if (client === null) throw new NullSeamClientError()
      return await client.thermostats.climateSettingSchedules.delete(
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
