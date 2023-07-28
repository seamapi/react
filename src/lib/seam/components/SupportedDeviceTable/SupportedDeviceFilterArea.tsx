import type { Dispatch, SetStateAction } from 'react'

import { FilterCategoryMenu } from 'lib/seam/components/SupportedDeviceTable/FilterCategoryMenu.js'
import type { DeviceModelFilters } from 'lib/seam/components/SupportedDeviceTable/use-filtered-device-models.js'
import { useDeviceModels } from 'lib/seam/device-models/use-device-models.js'
import { capitalize } from 'lib/strings.js'
import { Button } from 'lib/ui/Button.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'

interface SupportedDeviceFilterAreaProps {
  filterValue: string
  setFilterValue: (filter: string) => void
  filters: DeviceModelFilters
  setFilters: Dispatch<SetStateAction<DeviceModelFilters>>
  brands: string[] | null
}

export function SupportedDeviceFilterArea({
  filterValue,
  setFilterValue,
  filters,
  setFilters,
  brands,
}: SupportedDeviceFilterAreaProps): JSX.Element {
  const appliedFiltersCount = getAppliedFilterCount(filters)

  const availableBrands = useAvailableBrands(brands)

  const resetFilter = (filterType: keyof DeviceModelFilters): void => {
    setFilters((filters) => ({
      ...filters,
      [filterType]: null,
    }))
  }

  const filterButtonLabel =
    appliedFiltersCount > 0 ? `${t.filters} (${appliedFiltersCount})` : t.filter

  const allLabel = t.all

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
                label={t.brand}
                allLabel={allLabel}
                options={availableBrands}
                onSelect={(brand: string) => {
                  setFilters((filters) => ({
                    ...filters,
                    brand,
                  }))
                }}
                buttonLabel={filters.brand ?? allLabel}
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
                <p>{t.supported}</p>
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

const getAppliedFilterCount = (filters: DeviceModelFilters): number => {
  let count = 0
  if (filters.brand !== null) count++
  if (!filters.supportedOnly) count++
  return count
}

const useAvailableBrands = (brands: string[] | null): string[] => {
  const { deviceModels } = useDeviceModels()

  if (deviceModels == null) return []

  const uniqueBrands = new Set<string>()
  for (const deviceModel of deviceModels) {
    const value = deviceModel.brand

    // UPSTREAM: API can return an empty value for brand.
    if (value.trim() === '') continue

    uniqueBrands.add(deviceModel.brand)
  }

  return Array.from(uniqueBrands)
    .filter((brand) => {
      if (brands === null) return true
      return brands.includes(brand)
    })
    .map((brand) => capitalize(brand))
}

const t = {
  all: 'All',
  brand: 'Brand',
  supported: 'Supported',
  filter: 'Filter',
  filters: 'Filters',
}
