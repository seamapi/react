import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ClimateSettingSchedule,
  ClimateSettingSchedulesListResponse,
  ClimateSettingScheduleUpdateRequest,
  ClimateSettingScheduleUpdateResponse,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/index.js'

type UseUpdateClimateSettingScheduleData =
  ClimateSettingScheduleUpdateResponse['climate_setting_schedule']
type UseUpdateClimateSettingScheduleMutationParams =
  ClimateSettingScheduleUpdateRequest

export function useUpdateClimateSettingSchedule(): UseMutationResult<
  UseUpdateClimateSettingScheduleData,
  SeamError,
  UseUpdateClimateSettingScheduleMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateClimateSettingScheduleData,
    SeamError,
    UseUpdateClimateSettingScheduleMutationParams
  >({
    mutationFn: async (
      mutationPararms: UseUpdateClimateSettingScheduleMutationParams
    ) => {
      if (client === null) throw new NullSeamClientError()
      return await client.thermostats.climateSettingSchedules.update(
        mutationPararms
      )
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<ClimateSettingSchedule>(
        [
          'thermostats',
          'climate_setting_schedules',
          'get',
          {
            climate_setting_schedule_id: updated.climate_setting_schedule_id,
          },
        ],
        (climateSettingSchedule) => {
          if (climateSettingSchedule == null) {
            return
          }

          return {
            ...climateSettingSchedule,
            ...updated,
          }
        }
      )

      queryClient.setQueryData<
        ClimateSettingSchedulesListResponse['climate_setting_schedules']
      >(
        [
          'thermostats',
          'climate_setting_schedules',
          'list',
          { device_id: updated.device_id },
        ],
        (climateSettingSchedules): ClimateSettingSchedule[] => {
          if (climateSettingSchedules == null) {
            return []
          }

          return climateSettingSchedules.map((climateSettingSchedule) => {
            if (climateSettingSchedule.device_id === updated.device_id) {
              return {
                ...climateSettingSchedule,
                ...updated,
              }
            }

            return climateSettingSchedule
          })
        }
      )
    },
  })
}
