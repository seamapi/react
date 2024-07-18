import type {
  SeamHttpApiError,
  ThermostatsClimateSettingSchedulesCreateBody,
} from '@seamapi/http/connect'
import type { ClimateSettingSchedule } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCreateClimateSettingScheduleParams = never

export type UseCreateClimateSettingScheduleData = ClimateSettingSchedule

export type UseCreateClimateSettingScheduleMutationVariables =
  ThermostatsClimateSettingSchedulesCreateBody

export function useCreateClimateSettingSchedule(): UseMutationResult<
  UseCreateClimateSettingScheduleData,
  SeamHttpApiError,
  UseCreateClimateSettingScheduleMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseCreateClimateSettingScheduleData,
    SeamHttpApiError,
    UseCreateClimateSettingScheduleMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      return await client.thermostats.climateSettingSchedules.create(variables)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          'thermostats',
          'climate_setting_schedules',
          'get',
          { climate_setting_schedules: data.climate_setting_schedule_id },
        ],
        data
      )
      void queryClient.invalidateQueries({
        queryKey: ['thermostats', 'climate_setting_schedules', 'list'],
      })
    },
  })
}
