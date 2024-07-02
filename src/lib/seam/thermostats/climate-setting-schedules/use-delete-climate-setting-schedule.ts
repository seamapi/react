import type { SeamHttpApiError, ThermostatsClimateSettingSchedulesDeleteParams } from '@seamapi/http/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseDeleteClimateSettingScheduleParams = never

export type UseDeleteClimateSettingScheduleData = undefined

export type UseDeleteClimateSettingScheduleMutationVariables =
  ThermostatsClimateSettingSchedulesDeleteParams

export function useDeleteClimateSettingSchedule(): UseMutationResult<
  UseDeleteClimateSettingScheduleData,
  SeamHttpApiError,
  UseDeleteClimateSettingScheduleMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseDeleteClimateSettingScheduleData,
    SeamHttpApiError,
    UseDeleteClimateSettingScheduleMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.climateSettingSchedules.delete(variables)
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [
          'thermostats',
          'climate_setting_schedules',
          'get',
          { climate_setting_schedules: variables.climate_setting_schedule_id },
        ],
      })
      void queryClient.invalidateQueries({
        queryKey: ['thermostats', 'climate_setting_schedules', 'list'],
      })
    },
  })
}
