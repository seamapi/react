import { createIsoDate } from 'lib/dates.js'
import { useCreateClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-create-climate-setting-schedule.js'
import {
  ClimateSettingScheduleForm,
  type ClimateSettingScheduleFormSubmitData,
} from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'

export interface CreateClimateSettingScheduleFormProps {
  className?: string
  onBack?: () => void
}

export function CreateClimateSettingScheduleForm({
  className,
  onBack,
}: CreateClimateSettingScheduleFormProps): JSX.Element | null {
  return <Content className={className} onBack={onBack} />
}

function Content({
  className,
  onBack,
}: CreateClimateSettingScheduleFormProps): JSX.Element {
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
  const { mutate, isLoading: isSubmitting } = useCreateClimateSettingSchedule()
  const submit = (data: ClimateSettingScheduleFormSubmitData): void => {
    const { name, deviceId, startDate, endDate, timezone, climateSetting } =
      data
    if (name === '') {
      return
    }

    if (isSubmitting) {
      return
    }

    mutate(
      {
        name,
        device_id: deviceId,
        schedule_starts_at: createIsoDate(startDate, timezone),
        schedule_ends_at: createIsoDate(endDate, timezone),
        ...climateSetting,
      },
      {
        onSuccess,
      }
    )
  }

  return { submit, isSubmitting }
}