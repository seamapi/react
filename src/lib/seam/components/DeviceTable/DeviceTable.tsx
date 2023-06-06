import classNames from 'classnames'
import { useState } from 'react'

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

export interface DeviceTableProps {
  deviceIds?: string[]
  onDeviceClick?: (deviceId: string) => void
  onBack?: () => void
  className?: string
}

export function DeviceTable({
  deviceIds,
  onDeviceClick,
  onBack,
  className,
}: DeviceTableProps = {}): JSX.Element | null {
  const { devices, isLoading, isError, error } = useDevices({
    device_ids: deviceIds,
  })

  const [selectedDeviceId, selectDevice] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  if (devices == null) {
    return null
  }

  const deviceCount = devices.length

  const filteredDevices = devices.filter((device) => {
    if (searchTerm === '') {
      return true
    }

    return new RegExp(searchTerm, 'i').test(device.properties.name)
  })

  return (
    <div className={classNames('seam-device-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.devices} <Caption>({deviceCount})</Caption>
        </TableTitle>
        <SearchTextField
          value={searchTerm}
          onChange={setSearchTerm}
          disabled={deviceCount === 0}
        />
      </TableHeader>
      <TableBody>
        <Body
          devices={filteredDevices}
          onDeviceClick={onDeviceClick ?? selectDevice}
        />
      </TableBody>
    </div>
  )
}

function Body(props: {
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
  unknownLock: 'Unknown Lock',
  noDevicesMessage: 'Sorry, no devices were found',
}
