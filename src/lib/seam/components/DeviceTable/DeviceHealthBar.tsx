import type { ConnectedAccountError, DeviceError } from 'seamapi'

import { CheckIcon } from 'lib/icons/Check.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import { OnlineStatusAccountOfflineIcon } from 'lib/icons/OnlineStatusAccountOffline.js'
import type { UseDevicesData } from 'lib/seam/devices/use-devices.js'
import {
  connectedAccountErrorFilter,
  deviceErrorFilter,
} from 'lib/seam/filters.js'
import { TableFilterBar } from 'lib/ui/Table/TableFilterBar/TableFilterBar.js'
import { TableFilterItem } from 'lib/ui/Table/TableFilterBar/TableFilterItem.js'

export type AccountFilter = 'account_issues'
export type DeviceFilter = 'device_issues'

interface DeviceHealthBarProps {
  devices: Array<UseDevicesData[number]>
  filter: AccountFilter | DeviceFilter | null
  onFilterSelect: (filter: AccountFilter | DeviceFilter | null) => void
  errorFilter: (error: DeviceError | ConnectedAccountError) => boolean
}

export function DeviceHealthBar({
  devices,
  filter,
  onFilterSelect,
  errorFilter,
}: DeviceHealthBarProps): JSX.Element {
  const erroredAccounts = devices.filter((device) => {
    return (
      device.errors.filter(errorFilter).filter(connectedAccountErrorFilter)
        .length > 0
    )
  })
  const erroredDevices = devices.filter((device) => {
    return (
      device.errors.filter(errorFilter).filter(deviceErrorFilter).length > 0
    )
  })
  const accountIssueCount = erroredAccounts.length
  const deviceIssueCount = erroredDevices.length

  const toggle = (target: AccountFilter | DeviceFilter) => () => {
    const newFilter = target === filter ? null : target
    onFilterSelect(newFilter)
  }

  const deviceLabel =
    deviceIssueCount > 0
      ? `${deviceIssueCount} ${t.deviceIssues}`
      : `${deviceIssueCount} ${t.deviceIssue}`
  const accountLabel =
    accountIssueCount > 0
      ? `${accountIssueCount} ${t.accountIssues}`
      : `${accountIssueCount} ${t.accountIssue}`

  if (accountIssueCount === 0 && deviceIssueCount === 0) {
    return (
      <TableFilterBar filterCleared>
        <TableFilterItem>
          <CheckIcon />
          {t.devicesAndAccountsOk}
        </TableFilterItem>
      </TableFilterBar>
    )
  }

  return (
    <TableFilterBar
      filterCleared={filter == null}
      onFilterClear={() => {
        onFilterSelect(null)
      }}
    >
      {deviceIssueCount > 0 && (
        <TableFilterItem
          onClick={toggle('device_issues')}
          selected={filter === 'device_issues'}
        >
          <ExclamationCircleOutlineIcon />
          {deviceLabel}
        </TableFilterItem>
      )}
      {accountIssueCount > 0 && (
        <TableFilterItem
          onClick={toggle('account_issues')}
          selected={filter === 'account_issues'}
        >
          <OnlineStatusAccountOfflineIcon />
          {accountLabel}
        </TableFilterItem>
      )}
    </TableFilterBar>
  )
}

const t = {
  devicesAndAccountsOk: 'Devices & accounts OK',
  accountIssue: 'account issue',
  accountIssues: 'account issues',
  deviceIssue: 'device issue',
  deviceIssues: 'device issues',
}
