import classNames from 'classnames'
import { useMemo, useState } from 'react'

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
  deviceFilter?: (device: Device, searchInputValue: string) => boolean
  deviceComparator?: (deviceA: Device, deviceB: Device) => number
  onBack?: () => void
  className?: string
}

const defaultDeviceFilter = (device: Device, searchInputValue: string) => {
  const value = searchInputValue.trim()
  if (value === '') return true
  return new RegExp(value, 'i').test(device.properties.name ?? '')
}

export function DeviceTable({
  deviceIds,
  onBack,
  deviceFilter = defaultDeviceFilter,
  deviceComparator = compareByCreatedAtDesc,
  className,
}: DeviceTableProps = {}): JSX.Element {
  const { devices, isLoading, isError, error } = useDevices({
    device_ids: deviceIds,
  })

  const [selectedDeviceId, selectDevice] = useState<string | null>(null)
  const [searchInputValue, setSearchInputValue] = useState('')

  const filteredDevices = useMemo(
    () =>
      devices
        ?.filter((device) => deviceFilter(device, searchInputValue))
        ?.sort(deviceComparator) ?? [],
    [devices, searchInputValue, deviceFilter, deviceComparator]
  )

  if (selectedDeviceId != null) {
    return (
      <DeviceDetails
        className={className}
        deviceId={selectedDeviceId}
        onBack={() => {
          selectDevice(null)
        }}
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
        <Body devices={filteredDevices} selectDevice={selectDevice} />
      </TableBody>
    </div>
  )
}

function Body(props: {
  devices: Array<UseDevicesData[number]>
  selectDevice: (id: string) => void
}): JSX.Element {
  const { devices, selectDevice } = props
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
            selectDevice(device.device_id)
          }}
        />
      ))}
    </>
  )
}

const t = {
  devices: 'Devices',
  unknownLock: 'Unknown Lock',
  noDevicesMessage: 'Sorry, no devices were found',
}
