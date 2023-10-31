import classNames from 'classnames'
import { useState } from 'react'

import { useComponentTelemetry } from 'lib/telemetry/index.js'

import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { SupportedDeviceContent } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'
import { SupportedDeviceFilterArea } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceFilterArea.js'
import type { DeviceModelFilters } from 'lib/seam/components/SupportedDeviceTable/use-filtered-device-models.js'

import { useFilteredManufacturers } from './use-filtered-manufacturers.js'

export interface SupportedDeviceTableProps extends CommonProps {
  disableFilter?: boolean
  manufacturers?: string[] | null
  excludedManufacturers?: string[]
}

export const NestedSupportedDeviceTable =
  withRequiredCommonProps(SupportedDeviceTable)

export function SupportedDeviceTable({
  disableFilter = false,
  manufacturers = null,
  excludedManufacturers = [],
  className,
}: SupportedDeviceTableProps = {}): JSX.Element {
  useComponentTelemetry('SupportedDeviceTable')

  const [filterValue, setFilterValue] = useState('')
  const [filters, setFilters] = useState<DeviceModelFilters>({
    supportedOnly: true,
    manufacturer: null,
  })

  const { manufacturers: manufacturersData = [] } = useFilteredManufacturers({
    manufacturers:
      filters.manufacturer != null ? [filters.manufacturer] : manufacturers,
    excludedManufacturers,
  })

  return (
    <div
      className={classNames(
        'seam-supported-device-table-content-wrap',
        className
      )}
    >
      {!disableFilter && (
        <SupportedDeviceFilterArea
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filters={filters}
          setFilters={setFilters}
          manufacturers={manufacturersData}
        />
      )}
      <SupportedDeviceContent
        resetFilterValue={() => {
          setFilterValue('')
        }}
        filterValue={filterValue}
        filters={filters}
        manufacturers={manufacturersData}
      />
    </div>
  )
}
