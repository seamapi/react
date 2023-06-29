import classNames from 'classnames'
import { useState } from 'react'

import { SupportedDeviceContent } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'
import { SupportedDeviceFilterArea } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceFilterArea.js'
import type { DeviceModelFilters } from 'lib/seam/components/SupportedDeviceTable/use-filtered-device-models.js'

export interface SupportedDeviceTableProps {
  disableFilter?: boolean
  /**
   * @deprecated Use disableFilter.
   */
  cannotFilter?: boolean
  className?: string
  brands?: string[]
}

export function SupportedDeviceTable({
  disableFilter = false,
  cannotFilter,
  className,
  brands = [],
}: SupportedDeviceTableProps = {}): JSX.Element {
  const [filterValue, setFilterValue] = useState('')
  const [filters, setFilters] = useState<DeviceModelFilters>({
    supportedOnly: false,
    category: null,
    brand: null,
  })

  const hideFilter = cannotFilter ?? disableFilter

  return (
    <div
      className={classNames(
        'seam-supported-device-table-content-wrap',
        className
      )}
    >
      {!hideFilter && (
        <SupportedDeviceFilterArea
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filters={filters}
          setFilters={setFilters}
          brands={brands}
        />
      )}
      <SupportedDeviceContent
        resetFilterValue={() => {
          setFilterValue('')
        }}
        filterValue={filterValue}
        filters={filters}
        brands={brands}
      />
    </div>
  )
}
