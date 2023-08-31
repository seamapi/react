import type { ElementProps } from 'lib/element.js'

import type { ClimateSettingScheduleDetailsProps } from './ClimateSettingScheduleDetails.js'

export const name = 'seam-climate-setting-schedule-details'

export const props: ElementProps<ClimateSettingScheduleDetailsProps> = {
  climateSettingScheduleId: 'string',
  onBack: 'object',
  className: 'string',
}

export { ClimateSettingScheduleDetails as Component } from './ClimateSettingScheduleDetails.js'
