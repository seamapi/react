import type { ElementProps } from 'lib/element.js'

import type { ClimateSettingScheduleTableProps } from './ClimateSettingScheduleTable.js'

export const name = 'seam-climate-setting-schedule-table'

export const props: ElementProps<ClimateSettingScheduleTableProps> = {
  deviceId: 'string',
  onBack: 'object',
  className: 'string',
}

export { ClimateSettingScheduleTable as Component } from './ClimateSettingScheduleTable.js'
