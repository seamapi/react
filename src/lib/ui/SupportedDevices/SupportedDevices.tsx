import type { DeviceModel } from 'lib/ui/SupportedDevices/types.js'

import SupportedDeviceRow from './SupportedDeviceRow.js'
import SupportedDevicesHeader from './SupportedDevicesHeader.js'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from 'lib/ui/Button.js'

export interface SupportedDevicesProps {
  // If true, only show devices that are actively
  // supported and considered stable.
  includeOnlySupportedDevices?: boolean
}

export default function SupportedDevices({}: SupportedDevicesProps) {
  const { data, isLoading, isError, refetch } = useQuery<{
    data: {
      device_models: DeviceModel[]
    }
  }>({
    queryKey: ['supported_devices'],
    queryFn: async () => {
      return await axios.get('https://devicedb.seam.co/api/device_models/list')
    },
  })

  return (
    <>
      <div className='seam-supported-devices-table-wrap'>
        {isLoading && (
          <div className='seam-supported-devices-table-state-block'>
            <p>Loading device models...</p>
          </div>
        )}

        {isError && (
          <div className='seam-supported-devices-table-state-block'>
            <p>There was an error fetching device models.</p>
            <Button variant='solid' size='small' onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && data?.data?.device_models && (
          <table className='seam-supported-devices-table'>
            <SupportedDevicesHeader />
            <tbody>
              {data.data.device_models.map((deviceModel) => (
                <SupportedDeviceRow
                  key={deviceModel.manufacturer_model_id}
                  deviceModel={deviceModel}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
