import type { CommonProps } from 'lib/seam/components/common-props.js'
import { useCreateClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-create-climate-setting-schedule.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'
import {
  ClimateSettingScheduleForm,
  type ClimateSettingScheduleFormSubmitData,
} from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'

export interface CreateClimateSettingScheduleFormProps extends CommonProps {}

export function CreateClimateSettingScheduleForm({
  className,
  onBack,
}: CreateClimateSettingScheduleFormProps): JSX.Element | null {
  useComponentTelemetry('CreateClimateSettingScheduleForm')

  const { submit, isSubmitting } = useSubmitCreateClimateSettingSchedule(onBack)

  return (
    <ClimateSettingScheduleForm
      className={className}
      onBack={onBack}
      onSubmit={submit}
      isSubmitting={isSubmitting}
    />
  )
}

function useSubmitCreateClimateSettingSchedule(onSuccess?: () => void): {
  submit: (data: ClimateSettingScheduleFormSubmitData) => void
  isSubmitting: boolean
} {
  const { mutate, isPending: isSubmitting } = useCreateClimateSettingSchedule()
  const submit = (data: ClimateSettingScheduleFormSubmitData): void => {
    const { name, deviceId, startDate, endDate, climateSetting } = data

    if (isSubmitting) {
      return
    }

    mutate(
      {
        name,
        device_id: deviceId,
        schedule_starts_at: startDate,
        schedule_ends_at: endDate,
        ...climateSetting,
      },
      {
        onSuccess,
      }
    )
  }

  return { submit, isSubmitting }
}
