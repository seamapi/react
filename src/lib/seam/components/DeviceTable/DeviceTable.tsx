import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'
import { isLockDevice } from 'seamapi'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import {
  type DeviceFilter,
  DeviceHealthBar,
} from 'lib/seam/components/DeviceTable/DeviceHealthBar.js'
import { DeviceRow } from 'lib/seam/components/DeviceTable/DeviceRow.js'
import {
  useDevices,
  type UseDevicesData,
} from 'lib/seam/devices/use-devices.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { Caption } from 'lib/ui/typography/Caption.js'

type Device = UseDevicesData[number]

export interface DeviceTableProps {
  deviceIds?: string[]
  connectedAccountIds?: string[]
  disableLockUnlock?: boolean
  deviceFilter?: (device: Device, searchInputValue: string) => boolean
  deviceComparator?: (deviceA: Device, deviceB: Device) => number
  onDeviceClick?: (deviceId: string) => void
  preventDefaultOnDeviceClick?: boolean
  onBack?: () => void
  className?: string
}

const defaultDeviceFilter = (
  device: Device,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim()
  if (value === '') return true
  return new RegExp(value, 'i').test(device.properties.name ?? '')
}

export function DeviceTable({
  deviceIds,
  connectedAccountIds,
  disableLockUnlock = false,
  onDeviceClick = () => {},
  preventDefaultOnDeviceClick = false,
  onBack,
  deviceFilter = defaultDeviceFilter,
  deviceComparator = compareByCreatedAtDesc,
  className,
}: DeviceTableProps = {}): JSX.Element {
  const { devices, isLoading, isError, error } = useDevices({
    device_ids: deviceIds,
    connected_account_ids: connectedAccountIds,
  })

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [searchInputValue, setSearchInputValue] = useState('')

  const filteredDevices = useMemo(
    () =>
      devices
        ?.filter(isLockDevice)
        ?.filter((device) => deviceFilter(device, searchInputValue))
        ?.sort(deviceComparator) ?? [],
    [devices, searchInputValue, deviceFilter, deviceComparator]
  )

  const handleDeviceClick = useCallback(
    (deviceId: string): void => {
      onDeviceClick(deviceId)
      if (preventDefaultOnDeviceClick) return
      setSelectedDeviceId(deviceId)
    },
    [onDeviceClick, preventDefaultOnDeviceClick, setSelectedDeviceId]
  )

  if (selectedDeviceId != null) {
    return (
      <DeviceDetails
        className={className}
        deviceId={selectedDeviceId}
        onBack={() => {
          setSelectedDeviceId(null)
        }}
        disableLockUnlock={disableLockUnlock}
      />
    )
  }

  if (isLoading) {
    return <p className={className}>...</p>
  }

  if (isError) {
    return <p className={className}>{error?.message}</p>
  }

  return (
    <div className={classNames('seam-device-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.devices} <Caption>({filteredDevices.length})</Caption>
        </TableTitle>
        <SearchTextField
          value={searchInputValue}
          onChange={setSearchInputValue}
          disabled={(devices?.length ?? 0) === 0}
        />
      </TableHeader>
      <TableBody>
        <Content devices={filteredDevices} onDeviceClick={handleDeviceClick} />
      </TableBody>
    </div>
  )
}

function Content(props: {
  devices: Array<UseDevicesData[number]>
  onDeviceClick: (deviceId: string) => void
}): JSX.Element {
  const { devices, onDeviceClick } = props
  const [filter, setFilter] = useState<DeviceFilter | null>(null)

  if (devices.length === 0) {
    return <EmptyPlaceholder>{t.noDevicesMessage}</EmptyPlaceholder>
  }

  const filteredDevices = devices.filter((device) => {
    if (filter === null) {
      return true
    }

    if (filter === 'device_issues') {
      return device.errors.length > 0
    }

    return true
  })

  return (
    <>
      <DeviceHealthBar
        devices={devices}
        filter={filter}
        onFilterSelect={setFilter}
      />
      {filteredDevices.map((device) => (
        <DeviceRow
          device={device}
          key={device.device_id}
          onClick={() => {
            onDeviceClick(device.device_id)
          }}
        />
      ))}
    </>
  )
}

const t = {
  devices: 'Devices',
  noDevicesMessage: 'Sorry, no devices were found',
}
