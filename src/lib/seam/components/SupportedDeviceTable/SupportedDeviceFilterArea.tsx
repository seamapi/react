import type { Dispatch, SetStateAction } from 'react'

import { FilterCategoryMenu } from 'lib/seam/components/SupportedDeviceTable/FilterCategoryMenu.js'
import type {
  DeviceModel,
  Filters,
} from 'lib/seam/components/SupportedDeviceTable/types.js'
import { capitalize } from 'lib/strings.js'
import { Button } from 'lib/ui/Button.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'

interface SupportedDeviceFilterAreaProps {
  deviceModels: DeviceModel[]
  filterValue: string
  setFilterValue: (filter: string) => void
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

export function SupportedDeviceFilterArea({
  deviceModels,
  filterValue,
  setFilterValue,
  filters,
  setFilters,
}: SupportedDeviceFilterAreaProps) {
  const appliedFilters = Object.keys(filters).filter((key) => {
    const filterProperty = filters[key as keyof Filters]
    return (
      filterProperty !== undefined &&
      filterProperty !== null &&
      filterProperty !== false
    )
  })
  const appliedFiltersCount = appliedFilters.length

  const getAvailablePropertiesFromDeviceModels = (
    property: keyof DeviceModel
  ) => {
    const properties = new Set<string>()
    deviceModels.forEach((deviceModel) => {
      properties.add(capitalize(deviceModel[property]))
    })
    return Array.from(properties)
  }

  const resetFilter = (filterType: keyof Filters) => {
    setFilters((filters) => ({
      ...filters,
      [filterType]: null,
    }))
  }

  const isPlural = appliedFiltersCount > 1
  const filterButtonLabel = isPlural
    ? `Filters (${appliedFiltersCount})`
    : 'Filter'

  return (
    <div className='seam-supported-device-table-filter-area'>
      <div className='seam-deliberate-block' />
      <div className='seam-filters-wrap'>
        <Menu
          renderButton={({ onOpen }) => (
            <Button
              variant='outline'
              className='seam-filters-button'
              onClick={onOpen}
            >
              {filterButtonLabel}
            </Button>
          )}
        >
          <div
            className='seam-supported-device-table-filter-menu'
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className='seam-filter-menu-row'>
              <FilterCategoryMenu
                label='Brand'
                options={getAvailablePropertiesFromDeviceModels('brand')}
                onSelect={(brand: string) => {
                  setFilters((filters) => ({
                    ...filters,
                    brand,
                  }))
                }}
                buttonLabel={filters.brand ?? 'All'}
                onAllOptionSelect={() => {
                  resetFilter('brand')
                }}
              />
            </div>

            <div className='seam-filter-menu-row'>
              <label
                htmlFor='supportedOnly'
                className='seam-filter-checkbox-label'
              >
                <p>Supported</p>
                <input
                  id='supportedOnly'
                  name='supportedOnly'
                  type='checkbox'
                  className='seam-filter-checkbox'
                  checked={filters.supportedOnly}
                  onChange={(event) => {
                    setFilters((filters) => ({
                      ...filters,
                      supportedOnly: event.target.checked,
                    }))
                  }}
                />
              </label>
            </div>
          </div>
        </Menu>

        <div className='seam-supported-device-table-filter-area-search-bar-wrap'>
          <SearchTextField
            value={filterValue}
            onChange={(value) => {
              setFilterValue(value)
            }}
            className='seam-supported-device-table-filter-area-search-bar'
          />
        </div>
      </div>
    </div>
  )
}
