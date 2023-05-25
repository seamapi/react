import { useState } from 'react'

import {
  useDevices,
  type UseDevicesData,
  type UseDevicesParams,
} from 'lib/seam/devices/use-devices.js'
import { DeviceDetails } from 'lib/ui/DeviceDetails/DeviceDetails.js'
import {
  type DeviceFilter,
  DeviceHealthBar,
} from 'lib/ui/DeviceTable/DeviceHealthBar.js'
import { DeviceRow } from 'lib/ui/DeviceTable/DeviceRow.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { Caption } from 'lib/ui/typography/Caption.js'

export type DeviceTableProps = Props & UseDevicesParams

interface Props {
  onBack?: () => void
}

export function DeviceTable({
  onBack,
  ...props
}: DeviceTableProps): JSX.Element | null {
  const { devices, isLoading, isError, error } = useDevices(props)

  const [selectedDeviceId, selectDevice] = useState<string | null>(null)

  if (selectedDeviceId != null) {
    return (
      <DeviceDetails
        deviceId={selectedDeviceId}
        onBack={() => {
          selectDevice(null)
        }}
      />
    )
  }

  if (isLoading) {
    return <p>...</p>
  }

  if (isError) {
    return <p>{error?.message}</p>
  }

  if (devices == null) {
    return null
  }

  const deviceCount = devices.length

  return (
    <div className='seam-device-table'>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.devices} <Caption>({deviceCount})</Caption>
        </TableTitle>
      </TableHeader>
      <TableBody>
        <Body devices={devices} selectDevice={selectDevice} />
      </TableBody>
    </div>
  )
}

function Body(props: {
  devices: Array<UseDevicesData[number]>
  selectDevice: (id: string) => void
}) {
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
