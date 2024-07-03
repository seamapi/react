import type {
  SeamHttpApiError,
  ThermostatsClimateSettingSchedulesUpdateBody,
} from '@seamapi/http/connect'
import type { ClimateSettingSchedule } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { shake } from 'radash'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseUpdateClimateSettingScheduleParams = never

export type UseUpdateClimateSettingScheduleData = undefined

export type UseUpdateClimateSettingScheduleMutationVariables =
  ThermostatsClimateSettingSchedulesUpdateBody

export function useUpdateClimateSettingSchedule(): UseMutationResult<
  UseUpdateClimateSettingScheduleData,
  SeamHttpApiError,
  UseUpdateClimateSettingScheduleMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateClimateSettingScheduleData,
    SeamHttpApiError,
    UseUpdateClimateSettingScheduleMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.climateSettingSchedules.update(variables)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ClimateSettingSchedule | null>(
        [
          'thermostats',
          'climate_setting_schedules',
          'get',
          { climate_setting_schedules: variables.climate_setting_schedule_id },
        ],
        (climateSettingSchedule) => {
          if (climateSettingSchedule == null) {
            return
          }

          return {
            ...climateSettingSchedule,
            ...shake(variables),
          }
        }
      )

      queryClient.setQueryData<ClimateSettingSchedule[]>(
        ['thermostats', 'climate_setting_schedules', 'list'],
        (climateSettingSchedules) => {
          if (climateSettingSchedules == null) {
            return climateSettingSchedules
          }

          return climateSettingSchedules.map((climateSettingSchedule) => {
            if (
              climateSettingSchedule.climate_setting_schedule_id ===
              variables.climate_setting_schedule_id
            ) {
              return {
                ...climateSettingSchedule,
                ...shake(variables),
              }
            }

            return climateSettingSchedule
          })
        }
      )
    },
  })
}
