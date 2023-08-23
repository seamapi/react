import type { ElementProps } from 'lib/element.js'

import type { ClimateSettingScheduleDetailsProps } from './ClimateSettingScheduleDetails.js'

export const name = 'seam-access-code-details'

export const props: ElementProps<ClimateSettingScheduleDetailsProps> = {
  climateSettingScheduleId: 'string',
  disableLockUnlock: 'boolean',
  disableDeleteClimateSettingSchedule: 'boolean',
  onBack: 'object',
  onEdit: 'object',
  className: 'string',
}

export { ClimateSettingScheduleDetails as Component } from './ClimateSettingScheduleDetails.js'
