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

export interface SupportedDeviceTableProps extends CommonProps {
  disableFilter?: boolean
  brands?: string[] | null
  excludedBrands?: string[]
}

export const NestedSupportedDeviceTable =
  withRequiredCommonProps(SupportedDeviceTable)

export function SupportedDeviceTable({
  disableFilter = false,
  brands = null,
  excludedBrands = [],
  className,
}: SupportedDeviceTableProps = {}): JSX.Element {
  useComponentTelemetry('SupportedDeviceTable')

  const [filterValue, setFilterValue] = useState('')
  const [filters, setFilters] = useState<DeviceModelFilters>({
    supportedOnly: true,
    brand: null,
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
          brands={brands}
          excludedBrands={excludedBrands}
        />
      )}
      <SupportedDeviceContent
        resetFilterValue={() => {
          setFilterValue('')
        }}
        filterValue={filterValue}
        filters={filters}
        brands={brands}
        excludedBrands={excludedBrands}
      />
    </div>
  )
}
