import type { ElementProps } from 'lib/element.js'
import type { CreateClimateSettingScheduleFormProps } from 'lib/seam/components/CreateClimateSettingScheduleForm/CreateClimateSettingScheduleForm.js'

export const name = 'seam-create-access-code-form'

export const props: ElementProps<CreateClimateSettingScheduleFormProps> = {
  className: 'string',
  onBack: 'object',
}

export { CreateClimateSettingScheduleForm as Component } from './CreateClimateSettingScheduleForm.js'
