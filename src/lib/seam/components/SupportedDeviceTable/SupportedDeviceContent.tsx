import { Button } from 'lib/ui/Button.js'

import { SupportedDeviceHeader } from './SupportedDeviceHeader.js'
import { SupportedDeviceRow } from './SupportedDeviceRow.js'
import {
  type DeviceModelFilters,
  useFilteredDeviceModels,
} from './use-filtered-device-models.js'

interface SupportedDeviceContentProps {
  filterValue: string
  resetFilterValue: () => void
  filters: DeviceModelFilters
}

export function SupportedDeviceContent({
  resetFilterValue,
  filterValue,
  filters,
}: SupportedDeviceContentProps): JSX.Element | null {
  const { deviceModels, isLoading, isError, refetch } = useFilteredDeviceModels(
    filterValue,
    filters
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

  return (
    <table className='seam-supported-device-table-content'>
      <SupportedDeviceHeader />
      <tbody>
        {deviceModels.map((deviceModel) => (
          <SupportedDeviceRow
            key={deviceModel.manufacturer_model_id}
            deviceModel={deviceModel}
          />
        ))}
        {deviceModels.length === 0 && (
          <EmptyResult
            filterValue={filterValue}
            resetFilterValue={resetFilterValue}
          />
        )}
      </tbody>
    </table>
  )
}

function EmptyResult({
  filterValue,
  resetFilterValue,
}: Pick<SupportedDeviceContentProps, 'filterValue' | 'resetFilterValue'>) {
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

const t = {
  loading: 'Loading device models...',
  retry: 'Retry',
  error: 'There was an error fetching device models.',
  noneFound: 'No device models found.',
  noMatch: 'No device models matched your search.',
  clear: 'Clear search terms',
}
