import pluralize from 'pluralize'

import { CheckIcon } from 'lib/icons/Check.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import type { UseDevicesData } from 'lib/seam/devices/use-devices.js'
import { TableFilterItem } from 'lib/ui/Table/TableFilters/TableFilterItem.js'
import { TableFilters } from 'lib/ui/Table/TableFilters/TableFilters.js'

export type DeviceFilter = 'device_issues'

interface DeviceHealthBarProps {
  devices: Array<UseDevicesData[number]>
  filter: DeviceFilter | null
  onSelectFilter: (filter: DeviceFilter | null) => void
}

export function DeviceHealthBar({
  devices,
  filter,
  onSelectFilter,
}: DeviceHealthBarProps) {
  const errorDevices = devices.filter((device) => device.errors.length > 0)
  const numIssues = errorDevices.length

  const toggle = (target: DeviceFilter) => () => {
    const newFilter = target === filter ? null : target
    onSelectFilter(newFilter)
  }

  if (numIssues === 0) {
    return (
      <TableFilters>
        <TableFilterItem>
          <CheckIcon />
          {t.devicesOk}
        </TableFilterItem>
      </TableFilters>
    )
  }

  return (
    <TableFilters>
      <TableFilterItem
        onClick={toggle('device_issues')}
        selected={filter === 'device_issues'}
      >
        <ExclamationCircleOutlineIcon />
        {pluralize(t.deviceIssue, numIssues, true)}
      </TableFilterItem>
    </TableFilters>
  )
}

const t = {
  devicesOk: 'Devices OK',
  deviceIssue: 'device issue',
}
