import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ClimateSettingScheduleDeleteRequest,
  ClimateSettingScheduleDeleteResponse,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseDeleteClimateSettingScheduleMutationVariables =
  ClimateSettingScheduleDeleteRequest

export type UseDeleteClimateSettingScheduleData =
  ClimateSettingScheduleDeleteResponse

export function useDeleteClimateSettingSchedule(): UseMutationResult<
  UseDeleteClimateSettingScheduleData,
  SeamError,
  UseDeleteClimateSettingScheduleMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseDeleteClimateSettingScheduleData,
    SeamError,
    ClimateSettingScheduleDeleteRequest
  >({
    mutationFn: async (
      mutationParams: UseDeleteClimateSettingScheduleMutationVariables
    ) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.climateSettingSchedules.delete(mutationParams)
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [
          'thermostats',
          'climate_setting_schedules',
          'get',
          {
            climate_setting_schedule_id: variables.climate_setting_schedule_id,
          },
        ],
      })
      void queryClient.invalidateQueries({
        queryKey: ['thermostats', 'climate_setting_schedules', 'list'],
      })
    },
  })
}
