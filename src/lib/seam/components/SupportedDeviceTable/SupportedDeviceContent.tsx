import type { DeviceModel } from '@seamapi/types/devicedb'
import { useMemo } from 'react'

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
  includeIf: string[] | null
  excludeIf: string[]
}

export function SupportedDeviceContent({
  resetFilterValue,
  filterValue,
  filters,
  manufacturers,
  excludedManufacturers,
  includeIf,
  excludeIf,
}: SupportedDeviceContentProps): JSX.Element | null {
  const { deviceModels, isPending, isError, refetch } = useFilteredDeviceModels(
    {
      filterValue,
      filters,
      manufacturers,
      excludedManufacturers,
      includeIf,
      excludeIf,
    }
  )

  const groupedDeviceModels = useMemo(
    () => groupDeviceModelsByManufacturer(deviceModels ?? []),
    [deviceModels]
  )

  if (isPending) {
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

  return (
    <>
      {Object.entries(groupedDeviceModels)
        .sort(
          (e1, e2) =>
            e1[1][0]?.manufacturer.display_name.localeCompare(
              e2[1][0]?.manufacturer.display_name ?? ''
            ) ?? 0
        )
        .map(([manufacturerId, models]) => {
          return (
            <SupportedDeviceManufacturerSection
              key={manufacturerId}
              manufacturerId={manufacturerId}
              deviceModels={models}
            />
          )
        })}
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

const groupDeviceModelsByManufacturer = (
  deviceModels: UseDeviceModelsData
): Record<string, DeviceModel[]> => {
  const result: Record<string, DeviceModel[]> = {}

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
