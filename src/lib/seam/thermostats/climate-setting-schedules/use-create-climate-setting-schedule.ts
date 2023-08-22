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
export type UseCreateClimateSettingScheduleMutationParams =
  ClimateSettingScheduleCreateRequest

export function useCreateClimateSettingSchedule(): UseMutationResult<
  UseCreateClimateSettingScheduleData,
  SeamError,
  UseCreateClimateSettingScheduleMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    ClimateSettingScheduleCreateResponse['climate_setting_schedule'],
    SeamError,
    ClimateSettingScheduleCreateRequest
  >({
    mutationFn: async (
      mutationParams: UseCreateClimateSettingScheduleMutationParams
    ) => {
      if (client === null) throw new NullSeamClientError()
      return await client.thermostats.climateSettingSchedules.create(
        mutationParams
      )
    },
    onSuccess: () => {
      void queryClient.invalidateQueries([
        'thermostats',
        'climate_setting_schedules',
        'list',
      ])
    },
  })
}
