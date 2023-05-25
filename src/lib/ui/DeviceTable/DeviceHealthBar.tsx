import pluralize from 'pluralize'

import { CheckIcon } from 'lib/icons/Check.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import type { UseDevicesData } from 'lib/seam/devices/use-devices.js'
import { TableFilterBar } from 'lib/ui/Table/TableFilterBar/TableFilterBar.js'
import { TableFilterItem } from 'lib/ui/Table/TableFilterBar/TableFilterItem.js'

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
      <TableFilterBar>
        <TableFilterItem>
          <CheckIcon />
          {t.devicesOk}
        </TableFilterItem>
      </TableFilterBar>
    )
  }

  return (
    <TableFilterBar
      hasSelectedFilter={filter !== null}
      onClearFilters={() => {
        onSelectFilter(null)
      }}
    >
      <TableFilterItem
        onClick={toggle('device_issues')}
        selected={filter === 'device_issues'}
      >
        <ExclamationCircleOutlineIcon />
        {pluralize(t.deviceIssue, numIssues, true)}
      </TableFilterItem>
    </TableFilterBar>
  )
}

const t = {
  devicesOk: 'Devices OK',
  deviceIssue: 'device issue',
}
