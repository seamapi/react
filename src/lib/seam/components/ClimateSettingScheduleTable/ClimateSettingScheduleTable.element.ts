import type { ElementProps } from 'lib/element.js'
import type { ClimateSettingScheduleTableProps } from './ClimateSettingScheduleTable.js'

export const name = 'seam-climate-setting-schedule-table'

export const props: ElementProps<ClimateSettingScheduleTableProps> = {
  deviceId: 'string',
  disableSearch: 'boolean',
  climateSettingScheduleFilter: 'function',
  climateSettingScheduleComparator: 'function',
  onClimateSettingScheduleClick: 'function',
  preventDefaultOnClimateSettingScheduleClick: 'boolean',
  onBack: 'function',
  className: 'string',
}

export { ClimateSettingScheduleTable as Component } from './ClimateSettingScheduleTable.js'
