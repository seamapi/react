import type { ElementProps } from 'lib/element.js'
import type { ClimateSettingScheduleTableProps } from './ClimateSettingScheduleRow.js'

]
export const name = 'seam-device-table'

export const props: ElementProps<ClimateSettingScheduleTableProps> = {
  climateSettingScheduleIds: 'json',
  connectedAccountIds: 'json',
  disableLockUnlock: 'boolean',
  disableSearch: 'boolean',
  deviceFilter: 'function',
  deviceComparator: 'function',
  onClimateSettingScheduleClick: 'function',
  preventDefaultOnDeviceClick: 'boolean',
  onBack: 'function',
  className: 'string',
}

export { ClimateSettingScheduleTable as Component } from './ClimateSettingScheduleTable.js'
