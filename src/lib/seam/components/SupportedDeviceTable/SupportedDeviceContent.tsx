import type { DeviceModel } from 'seamapi'

import { SupportedDeviceBrandSection } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceBrandSection.js'
import { SupportedDeviceFilterResultRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceFilterResultRowProps.js'
import {
  type DeviceModelFilters,
  useFilteredDeviceModels,
} from 'lib/seam/components/SupportedDeviceTable/use-filtered-device-models.js'
import type { UseDeviceModelsData } from 'lib/seam/device-models/use-device-models.js'
import { Button } from 'lib/ui/Button.js'

interface SupportedDeviceContentProps {
  filterValue: string
  resetFilterValue: () => void
  filters: DeviceModelFilters
  brands: string[]
}

export function SupportedDeviceContent({
  resetFilterValue,
  filterValue,
  filters,
  brands,
}: SupportedDeviceContentProps): JSX.Element | null {
  const { deviceModels, isLoading, isError, refetch } = useFilteredDeviceModels(
    {
      filterValue,
      filters,
      brands,
    }
  )

  if (isLoading) {
    return (
      <div className='seam-supported-device-table-content-state-block'>
        <p>{t.loading}</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='seam-supported-device-table-content-state-block'>
        <p>{t.error}</p>
        <Button
          variant='solid'
          size='small'
          onClick={() => {
            void refetch()
          }}
        >
          {t.retry}
        </Button>
      </div>
    )
  }

  if (deviceModels == null) {
    return null
  }

  const isEmpty = deviceModels.length === 0
  if (isEmpty) {
    return (
      <div className='seam-supported-device-table-content'>
        <EmptyResult
          filterValue={filterValue}
          resetFilterValue={resetFilterValue}
        />
      </div>
    )
  }

  // If there are no active filters or search, show all the rows without any brand sections.
  const hasFilters =
    filterValue.trim() !== '' ||
    filters.supportedOnly ||
    filters.category !== null ||
    filters.brand !== null
  if (hasFilters) {
    return (
      <div className='seam-supported-device-table-content'>
        {deviceModels.map((deviceModel, index) => (
          <SupportedDeviceFilterResultRow
            key={[
              deviceModel.main_category,
              deviceModel.brand,
              deviceModel.model_name,
              deviceModel.manufacturer_model_id,
              index,
            ].join(':')}
            deviceModel={deviceModel}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      {Object.entries(groupDeviceModelsByBrand(deviceModels)).map(
        ([brand, models]) => (
          <SupportedDeviceBrandSection
            key={brand}
            brand={brand}
            deviceModels={models}
          />
        )
      )}
    </>
  )
}

function EmptyResult({
  filterValue,
  resetFilterValue,
}: Pick<
  SupportedDeviceContentProps,
  'filterValue' | 'resetFilterValue'
>): JSX.Element {
  const noMatchingRows = (
    <>
      <p>{t.noMatch}</p>
      <Button
        variant='outline'
        size='small'
        onClick={resetFilterValue}
        className='seam-supported-device-table-content-message-clear-search'
      >
        {t.clear}
      </Button>
    </>
  )

  return (
    <tr className='seam-supported-device-table-content-message-row'>
      <td colSpan={6}>
        <div className='seam-supported-device-table-content-message'>
          {filterValue.length === 0 ? <p>{t.noneFound}</p> : noMatchingRows}
        </div>
      </td>
    </tr>
  )
}

function groupDeviceModelsByBrand(
  deviceModels: UseDeviceModelsData
): Record<string, DeviceModel[]> {
  const result: Record<string, DeviceModel[]> = {}

  for (const model of deviceModels) {
    const { brand } = model
    const list = result[brand] ?? []
    result[brand] = [...list, model]
  }
  return result
}

const t = {
  loading: 'Loading device models...',
  retry: 'Retry',
  error: 'There was an error fetching device models.',
  noneFound: 'No device models found.',
  noMatch: 'No device models matched your search.',
  clear: 'Clear search terms',
}
