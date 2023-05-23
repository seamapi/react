import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { Button } from 'lib/ui/Button.js'
import SupportedDevicesFilterArea from 'lib/ui/SupportedDevices/SupportedDevicesFilterArea.js'
import type { DeviceModel, Filters } from 'lib/ui/SupportedDevices/types.js'

import SupportedDeviceRow from './SupportedDeviceRow.js'
import SupportedDevicesHeader from './SupportedDevicesHeader.js'
import { useMemo, useState } from 'react'
import { Link } from '@mui/material'

export interface SupportedDevicesProps {
  // If true, show the filter area and search bar
  showFilterArea?: boolean
}

export default function SupportedDevices({
  showFilterArea,
}: SupportedDevicesProps) {
  const [filterStr, setFilterStr] = useState('')
  const [filters, setFilters] = useState<Filters>({
    supportedOnly: false,
  })

  const { data, isLoading, isError, refetch } = useQuery<{
    data: {
      device_models?: DeviceModel[]
    }
  }>({
    queryKey: ['supported_devices'],
    queryFn: async () => {
      return await axios.get('https://devicedb.seam.co/api/device_models/list')
    },
  })

  const filteredDeviceModels = useMemo(() => {
    return (
      data?.data?.device_models?.filter((deviceModel) => {
        if (filterStr === '') {
          return true
        }

        const filterStrLower = filterStr.toLowerCase()

        const filterableProperties = [
          deviceModel.main_category,
          deviceModel.model_name,
          deviceModel.manufacturer_model_id,
          deviceModel.connection_type,
          deviceModel.support_level,
          deviceModel.brand,
        ]

        return filterableProperties.some((property) => {
          if (property === null) {
            return false
          }

          return property.toLowerCase().includes(filterStrLower)
        })
      }) ?? []
    )
  }, [data?.data?.device_models, filterStr])

  return (
    <>
      <div className='seam-supported-devices-table-wrap'>
        {showFilterArea && (
          <SupportedDevicesFilterArea
            filterStr={filterStr}
            setFilterStr={setFilterStr}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        {isLoading && (
          <div className='seam-supported-devices-table-state-block'>
            <p>Loading device models...</p>
          </div>
        )}

        {isError && (
          <div className='seam-supported-devices-table-state-block'>
            <p>There was an error fetching device models.</p>
            <Button
              variant='solid'
              size='small'
              onClick={() => {
                void refetch()
              }}
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && data?.data?.device_models !== null && (
          <table className='seam-supported-devices-table'>
            <SupportedDevicesHeader />
            <tbody>
              {filteredDeviceModels.length !== 0 &&
                filteredDeviceModels.map((deviceModel, index) => (
                  <SupportedDeviceRow
                    key={`${index}:${deviceModel.manufacturer_model_id}`}
                    deviceModel={deviceModel}
                  />
                ))}

              {filteredDeviceModels.length === 0 && (
                <tr className='seam-supported-devices-table-message-row'>
                  <td colSpan={6}>
                    <div className='seam-supported-devices-table-message'>
                      {filterStr.length === 0 ? (
                        <p>No device models found.</p>
                      ) : (
                        <>
                          <p>No device models matched your search.</p>
                          <Link onClick={() => setFilterStr('')}>
                            Clear search terms
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

SupportedDevices.defaultProps = {
  showFilterArea: true,
}
