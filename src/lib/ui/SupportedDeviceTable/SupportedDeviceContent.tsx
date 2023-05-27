import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from 'lib/ui/Button.js'
import { SupportedDeviceFilterArea } from 'lib/ui/SupportedDeviceTable/SupportedDeviceFilterArea.js'
import type { DeviceModel, Filters } from 'lib/ui/SupportedDeviceTable/types.js'

import { SupportedDeviceHeader } from './SupportedDeviceHeader.js'
import { SupportedDeviceRow } from './SupportedDeviceRow.js'

export interface SupportedDeviceContentProps {
  cannotFilter?: boolean
}

export function SupportedDeviceContent({
  cannotFilter = false,
}: SupportedDeviceContentProps) {
  const [filterValue, setFilterValue] = useState('')
  const [filters, setFilters] = useState<Filters>({
    supportedOnly: false,
    category: null,
    brand: null,
  })

  const {
    data: deviceModels,
    isLoading,
    isError,
    refetch,
  } = useQuery<DeviceModel[]>({
    queryKey: ['supported_devices', filterValue, filters],
    queryFn: async () => {
      const url = new URL('https://devicedb.seam.co/api/device_models/list')

      if (filterValue.trim() !== '') {
        url.searchParams.set('text_search', filterValue.trim())
      }

      if (filters.supportedOnly) {
        url.searchParams.set('support_level', 'live')
      }

      if (filters.category !== null) {
        url.searchParams.set('main_category', filters.category)
      }

      if (filters.brand !== null) {
        url.searchParams.set('brand', filters.brand)
      }

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error('Failed to load device models')
      }
      const data = await res.json()
      return data?.device_models ?? []
    },
  })

  return (
    <div className='seam-supported-device-table-content-wrap'>
      {!cannotFilter && (
        <SupportedDeviceFilterArea
          deviceModels={deviceModels ?? []}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {isLoading && (
        <div className='seam-supported-device-table-content-state-block'>
          <p>Loading device models...</p>
        </div>
      )}

      {isError && (
        <div className='seam-supported-device-table-content-state-block'>
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

      {!isLoading && !isError && deviceModels !== null && (
        <table className='seam-supported-device-table-content'>
          <SupportedDeviceHeader />
          <tbody>
            {deviceModels.length !== 0 &&
              deviceModels.map((deviceModel, index) => (
                <SupportedDeviceRow
                  key={`${index}:${deviceModel.manufacturer_model_id}`}
                  deviceModel={deviceModel}
                />
              ))}

            {deviceModels.length === 0 && (
              <tr className='seam-supported-device-table-content-message-row'>
                <td colSpan={6}>
                  <div className='seam-supported-device-table-content-message'>
                    {filterValue.length === 0 ? (
                      <p>No device models found.</p>
                    ) : (
                      <>
                        <p>No device models matched your search.</p>
                        <Button
                          variant='outline'
                          size='small'
                          onClick={() => {
                            setFilterValue('')
                          }}
                          className='seam-supported-device-table-content-message-clear-search'
                        >
                          Clear search terms
                        </Button>
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
  )
}
