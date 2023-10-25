import type { Dispatch, SetStateAction } from 'react'

import { FilterCategoryMenu } from 'lib/seam/components/SupportedDeviceTable/FilterCategoryMenu.js'
import type { DeviceModelFilters } from 'lib/seam/components/SupportedDeviceTable/use-filtered-device-models.js'
import { Button } from 'lib/ui/Button.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'

import { useFilteredManufacturers } from './use-filtered-manufacturers.js'

interface SupportedDeviceFilterAreaProps {
  filterValue: string
  setFilterValue: (filter: string) => void
  filters: DeviceModelFilters
  setFilters: Dispatch<SetStateAction<DeviceModelFilters>>
  manufacturers: string[] | null
  excludedManufacturers: string[]
}

export function SupportedDeviceFilterArea({
  filterValue,
  setFilterValue,
  filters,
  setFilters,
  manufacturers,
  excludedManufacturers,
}: SupportedDeviceFilterAreaProps): JSX.Element {
  const appliedFiltersCount = getAppliedFilterCount(filters)

  const { manufacturers: manufacturersData } = useFilteredManufacturers({
    manufacturers,
    excludedManufacturers,
  })

  const resetFilter = (filterType: keyof DeviceModelFilters): void => {
    setFilters((filters) => ({
      ...filters,
      [filterType]: null,
    }))
  }

  const filterButtonLabel =
    appliedFiltersCount > 0 ? `${t.filters} (${appliedFiltersCount})` : t.filter

  const allLabel = t.all

  const options =
    manufacturersData
      ?.filter((manufacturer) => {
        if (filters.supportedOnly) {
          return ['stable', 'beta'].includes(manufacturer.integration)
        }
        return true
      })
      ?.map((manufacturer) => manufacturer.display_name) ?? []

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
                label={t.manufacturer}
                allLabel={allLabel}
                options={options}
                onSelect={(manufacturer: string) => {
                  setFilters((filters) => ({
                    ...filters,
                    manufacturer,
                  }))
                }}
                buttonLabel={filters.manufacturer ?? allLabel}
                onAllOptionSelect={() => {
                  resetFilter('manufacturer')
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
  if (filters.manufacturer !== null) count++
  if (!filters.supportedOnly) count++
  return count
}

const t = {
  all: 'All',
  manufacturer: 'Manufacturer',
  supported: 'Supported',
  filter: 'Filter',
  filters: 'Filters',
}
