import { useState } from 'react'

import { SupportedDeviceContent } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'

import { SupportedDeviceFilterArea } from './SupportedDeviceFilterArea.js'
import { type DeviceModelFilters } from './use-filtered-device-models.js'

export interface SupportedDeviceTableProps {
  cannotFilter?: boolean
}

export function SupportedDeviceTable({
  cannotFilter = false,
}: SupportedDeviceTableProps): JSX.Element {
  const [filterValue, setFilterValue] = useState('')
  const [filters, setFilters] = useState<DeviceModelFilters>({
    supportedOnly: false,
    category: null,
    brand: null,
  })

  return (
    <div className='seam-supported-device-table-content-wrap'>
      {!cannotFilter && (
        <SupportedDeviceFilterArea
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <SupportedDeviceContent
        resetFilterValue={() => {
          setFilterValue('')
        }}
        filterValue={filterValue}
        filters={filters}
      />
    </div>
  )
}
