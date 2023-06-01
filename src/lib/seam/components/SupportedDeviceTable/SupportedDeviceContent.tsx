import { useState } from 'react'

import { SupportedDeviceFilterArea } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceFilterArea.js'
import { Button } from 'lib/ui/Button.js'

import { SupportedDeviceHeader } from './SupportedDeviceHeader.js'
import { SupportedDeviceRow } from './SupportedDeviceRow.js'
import {
  type DeviceModelFilters,
  useFilteredDeviceModels,
} from './use-filtered-device-models.js'

export interface SupportedDeviceContentProps {
  cannotFilter?: boolean
}

export function SupportedDeviceContent({
  cannotFilter = false,
}: SupportedDeviceContentProps): JSX.Element {
  const [filterValue, setFilterValue] = useState('')
  const [filters, setFilters] = useState<DeviceModelFilters>({
    supportedOnly: false,
    category: null,
    brand: null,
  })
  const { deviceModels, isLoading, isError, refetch } = useFilteredDeviceModels(
    filterValue,
    filters
  )
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
            {deviceModels?.length !== 0 &&
              deviceModels?.map((deviceModel) => (
                <SupportedDeviceRow
                  key={deviceModel.manufacturer_model_id}
                  deviceModel={deviceModel}
                />
              ))}

            {deviceModels?.length === 0 && (
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
