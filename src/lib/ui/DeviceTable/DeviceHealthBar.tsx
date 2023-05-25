import { CheckIcon } from 'lib/icons/Check.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import type { UseDevicesData } from 'lib/seam/devices/use-devices.js'
import { TableFilterBar } from 'lib/ui/Table/TableFilterBar/TableFilterBar.js'
import { TableFilterItem } from 'lib/ui/Table/TableFilterBar/TableFilterItem.js'

export type DeviceFilter = 'device_issues'

interface DeviceHealthBarProps {
  devices: Array<UseDevicesData[number]>
  filter: DeviceFilter | null
  onFilterSelect: (filter: DeviceFilter | null) => void
}

export function DeviceHealthBar({
  devices,
  filter,
  onFilterSelect,
}: DeviceHealthBarProps) {
  const erroredDevices = devices.filter((device) => device.errors.length > 0)
  const issueCount = erroredDevices.length

  const toggle = (target: DeviceFilter) => () => {
    const newFilter = target === filter ? null : target
    onFilterSelect(newFilter)
  }

  const isPlural = issueCount === 0 || issueCount > 1
  const label = isPlural
    ? `${issueCount} ${t.deviceIssues}`
    : `${issueCount} ${t.deviceIssue}`

  if (issueCount === 0) {
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
      isFilterCleared={filter == null}
      onFilterClear={() => {
        onFilterSelect(null)
      }}
    >
      <TableFilterItem
        onClick={toggle('device_issues')}
        selected={filter === 'device_issues'}
      >
        <ExclamationCircleOutlineIcon />
        {label}
      </TableFilterItem>
    </TableFilterBar>
  )
}

const t = {
  devicesOk: 'Devices OK',
  deviceIssue: 'device issue',
  deviceIssues: 'device issues',
}
