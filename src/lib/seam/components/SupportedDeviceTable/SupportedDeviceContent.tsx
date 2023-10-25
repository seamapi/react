import type { DeviceModelV1 } from '@seamapi/types/devicedb'

import { SupportedDeviceFilterResultRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceFilterResultRow.js'
import { SupportedDeviceManufacturerSection } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceManufacturerSection.js'
import type { UseDeviceModelsData } from 'lib/seam/components/SupportedDeviceTable/use-device-models.js'
import {
  type DeviceModelFilters,
  useFilteredDeviceModels,
} from 'lib/seam/components/SupportedDeviceTable/use-filtered-device-models.js'
import { Button } from 'lib/ui/Button.js'

interface SupportedDeviceContentProps {
  filterValue: string
  resetFilterValue: () => void
  filters: DeviceModelFilters
  manufacturers: string[] | null
  excludedManufacturers: string[]
}

export function SupportedDeviceContent({
  resetFilterValue,
  filterValue,
  filters,
  manufacturers,
  excludedManufacturers,
}: SupportedDeviceContentProps): JSX.Element | null {
  const { deviceModels, isLoading, isError, refetch } = useFilteredDeviceModels(
    {
      filterValue,
      filters,
      manufacturers,
      excludedManufacturers,
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

  const hasFilters = filterValue.trim() !== '' || filters.manufacturer !== null

  if (hasFilters) {
    return (
      <div className='seam-supported-device-table-content'>
        {deviceModels.map((deviceModel) => (
          <SupportedDeviceFilterResultRow
            key={deviceModel.device_model_id}
            deviceModel={deviceModel}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      {Object.entries(groupDeviceModelsByManufacturer(deviceModels)).map(
        ([manufacturerId, models]) => (
          <SupportedDeviceManufacturerSection
            key={manufacturerId}
            manufacturerId={manufacturerId}
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
    <div className='seam-supported-device-table-content-message-row'>
      <div>
        <div className='seam-supported-device-table-content-message'>
          {filterValue.length === 0 ? <p>{t.noneFound}</p> : noMatchingRows}
        </div>
      </div>
    </div>
  )
}

function groupDeviceModelsByManufacturer(
  deviceModels: UseDeviceModelsData
): Record<string, DeviceModelV1[]> {
  const result: Record<string, DeviceModelV1[]> = {}

  for (const model of deviceModels) {
    const { manufacturer } = model
    const list = result[manufacturer.manufacturer_id] ?? []
    result[manufacturer.manufacturer_id] = [...list, model]
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
