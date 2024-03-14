import classNames from 'classnames'
import { useState } from 'react'

import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { SupportedDeviceContent } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'
import { SupportedDeviceFilterArea } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceFilterArea.js'
import type { DeviceModelFilters } from 'lib/seam/components/SupportedDeviceTable/use-filtered-device-models.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'

export interface SupportedDeviceTableProps extends CommonProps {
  disableFilter?: boolean
  manufacturers?: string[] | null
  excludedManufacturers?: string[]
  includeIf?: string[] | null
  excludeIf?: string[]
}

export const NestedSupportedDeviceTable =
  withRequiredCommonProps(SupportedDeviceTable)

export function SupportedDeviceTable({
  disableFilter = false,
  manufacturers = null,
  excludedManufacturers = [],
  includeIf = null,
  excludeIf = [],
  className,
}: SupportedDeviceTableProps = {}): JSX.Element {
  useComponentTelemetry('SupportedDeviceTable')

  const [filterValue, setFilterValue] = useState('')
  const [filters, setFilters] = useState<DeviceModelFilters>({
    supportedOnly: true,
    manufacturer: null,
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
          manufacturers={manufacturers}
          excludedManufacturers={excludedManufacturers}
        />
      )}
      <SupportedDeviceContent
        resetFilterValue={() => {
          setFilterValue('')
        }}
        filterValue={filterValue}
        filters={filters}
        manufacturers={manufacturers}
        excludedManufacturers={excludedManufacturers}
        includeIf={includeIf}
        excludeIf={excludeIf}
      />
    </div>
  )
}
