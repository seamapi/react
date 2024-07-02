import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ClimateSettingSchedule,
  ClimateSettingScheduleCreateRequest,
  ClimateSettingScheduleCreateResponse,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCreateClimateSettingScheduleData = ClimateSettingSchedule

export type UseCreateClimateSettingScheduleMutationVariables =
  ClimateSettingScheduleCreateRequest

export function useCreateClimateSettingSchedule(): UseMutationResult<
  UseCreateClimateSettingScheduleData,
  SeamError,
  UseCreateClimateSettingScheduleMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    ClimateSettingScheduleCreateResponse['climate_setting_schedule'],
    SeamError,
    ClimateSettingScheduleCreateRequest
  >({
    mutationFn: async (
      variables: UseCreateClimateSettingScheduleMutationVariables
    ) => {
      if (client === null) throw new NullSeamClientError()
      const result =
        await client.thermostats.climateSettingSchedules.create(variables)
      return result
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['thermostats', 'climate_setting_schedules', 'list'],
      })
    },
  })
}
