import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'
import { type CommonDevice, isLockDevice, isThermostatDevice } from 'seamapi'

import { useTelemetryOnMount } from 'lib/telemetry/index.js'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { NestedDeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import {
  type AccountFilter,
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

export interface DeviceTableProps extends CommonProps {
  deviceIds?: string[]
  connectedAccountIds?: string[]
  disableSearch?: boolean
  deviceFilter?: (device: Device, searchInputValue: string) => boolean
  deviceComparator?: (deviceA: Device, deviceB: Device) => number
  onDeviceClick?: (deviceId: string) => void
  preventDefaultOnDeviceClick?: boolean
  heading?: string | null
  /**
   * @deprecated Use heading.
   */
  title?: string | null
}

export const defaultDeviceFilter = (
  device: CommonDevice,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim()
  if (value === '') return true
  return device.properties.name.toLowerCase().includes(value)
}

export const NestedDeviceTable = withRequiredCommonProps(DeviceTable)

export function DeviceTable({
  deviceIds,
  connectedAccountIds,
  disableSearch = false,
  onDeviceClick = () => {},
  preventDefaultOnDeviceClick = false,
  deviceFilter = defaultDeviceFilter,
  deviceComparator = compareByCreatedAtDesc,
  heading = t.devices,
  title = t.devices,
  disableLockUnlock = false,
  disableCreateAccessCode = false,
  disableEditAccessCode = false,
  disableDeleteAccessCode = false,
  onBack,
  className,
}: DeviceTableProps = {}): JSX.Element {
  useTelemetryOnMount(DeviceTable.name)

  const { devices, isLoading, isError, error } = useDevices({
    device_ids: deviceIds,
    connected_account_ids: connectedAccountIds,
  })

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [searchInputValue, setSearchInputValue] = useState('')

  const filteredDevices = useMemo(
    () =>
      devices
        ?.filter((device) => isLockDevice(device) || isThermostatDevice(device))
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
      <NestedDeviceDetails
        deviceId={selectedDeviceId}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        onBack={() => {
          setSelectedDeviceId(null)
        }}
        className={className}
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
        {title != null ? (
          <TableTitle>
            {heading ?? title ?? t.devices}{' '}
            <Caption>({filteredDevices.length})</Caption>
          </TableTitle>
        ) : (
          <div className='seam-fragment' />
        )}
        {!disableSearch && (
          <SearchTextField
            value={searchInputValue}
            onChange={setSearchInputValue}
            disabled={(devices?.length ?? 0) === 0}
          />
        )}
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
  const [filter, setFilter] = useState<AccountFilter | DeviceFilter | null>(
    null
  )

  if (devices.length === 0) {
    return <EmptyPlaceholder>{t.noDevicesMessage}</EmptyPlaceholder>
  }

  const filteredDevices = devices.filter((device) => {
    if (filter === null) {
      return true
    }

    if (filter === 'account_issues') {
      return (
        device.errors.filter((error) => 'is_connected_account_error' in error)
          .length > 0
      )
    }

    if (filter === 'device_issues') {
      return (
        device.errors.filter((error) => 'is_device_error' in error).length > 0
      )
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
