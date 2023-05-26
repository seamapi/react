import { Link } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { Button } from 'lib/ui/Button.js'
import { SupportedDevicesFilterArea } from 'lib/ui/SupportedDevices/SupportedDevicesFilterArea.js'
import type { DeviceModel, Filters } from 'lib/ui/SupportedDevices/types.js'

import { SupportedDeviceRow } from './SupportedDeviceRow.js'
import { SupportedDevicesHeader } from './SupportedDevicesHeader.js'

const BASE_URL = 'https://devicedb.seam.co/api/device_models/list'

export interface SupportedDevicesProps {
  // If true, show the filter area and search bar
  showFilterArea?: boolean
}

export function SupportedDevices({
  showFilterArea = true,
}: SupportedDevicesProps) {
  const [allDeviceModels, setAllDeviceModels] = useState<DeviceModel[]>([])
  const [filterStr, setFilterStr] = useState('')
  const [filters, setFilters] = useState<Filters>({
    supportedOnly: false,
    category: null,
    brand: null,
  })

  const fetchDeviceModels = useCallback(async () => {
    const queries = []

    if (filterStr.trim() !== '') {
      queries.push(`text_search=${encodeURIComponent(filterStr.trim())}`)
    }

    if (filters.supportedOnly) {
      queries.push('support_level=live')
    }

    if (filters.category !== null) {
      queries.push(`main_category=${encodeURIComponent(filters.category)}`)
    }

    if (filters.brand !== null) {
      queries.push(`brand=${encodeURIComponent(filters.brand)}`)
    }

    const url = `${BASE_URL}?${queries.join('&')}`
    return await axios.get(url)
  }, [filterStr, filters])

  const { data, isLoading, isError, refetch } = useQuery<{
    data: {
      device_models?: DeviceModel[]
    }
  }>({
    queryKey: ['supported_devices', filterStr, filters],
    queryFn: fetchDeviceModels,
  })

  useEffect(() => {
    if (
      data?.data?.device_models !== undefined &&
      allDeviceModels.length === 0
    ) {
      setAllDeviceModels(data.data.device_models)
    }
  }, [data, allDeviceModels.length])

  const deviceModels = data?.data?.device_models ?? []

  return (
    <>
      <div className='seam-supported-devices-table-wrap'>
        {Boolean(showFilterArea) && (
          <SupportedDevicesFilterArea
            deviceModels={allDeviceModels}
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
              {deviceModels.length !== 0 &&
                deviceModels.map((deviceModel, index) => (
                  <SupportedDeviceRow
                    key={`${index}:${deviceModel.manufacturer_model_id}`}
                    deviceModel={deviceModel}
                  />
                ))}

              {deviceModels.length === 0 && (
                <tr className='seam-supported-devices-table-message-row'>
                  <td colSpan={6}>
                    <div className='seam-supported-devices-table-message'>
                      {filterStr.length === 0 ? (
                        <p>No device models found.</p>
                      ) : (
                        <>
                          <p>No device models matched your search.</p>
                          <Link
                            onClick={() => {
                              setFilterStr('')
                            }}
                          >
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
