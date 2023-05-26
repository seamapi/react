import { capitalize } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'

import { CloseIcon } from 'lib/icons/Close.js'
import { SearchIcon } from 'lib/icons/Search.js'
import { Button } from 'lib/ui/Button.js'
import Menu from 'lib/ui/Menu/Menu.js'
import { FilterCategoryMenu } from 'lib/ui/SupportedDevices/FilterCategoryMenu.js'
import type { DeviceModel, Filters } from 'lib/ui/SupportedDevices/types.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

interface SupportedDevicesFilterAreaProps {
  deviceModels: DeviceModel[]
  filterValue: string
  setFilterValue: (filter: string) => void
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

export function SupportedDevicesFilterArea({
  deviceModels,
  filterValue,
  setFilterValue,
  filters,
  setFilters,
}: SupportedDevicesFilterAreaProps) {
  const appliedFilters = Object.keys(filters).filter((key) => {
    return (
      filters[key as keyof Filters] !== undefined &&
      filters[key as keyof Filters] !== null &&
      filters[key as keyof Filters] !== false
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
    <div className='seam-supported-devices-filter-area'>
      <div className='seam-deliberate-block' />
      <div className='seam-filters-wrap'>
        <Menu
          button={({ open }) => (
            <Button
              variant='outline'
              className='seam-filters-button'
              onClick={open}
            >
              {filterButtonLabel}
            </Button>
          )}
        >
          <div
            className='seam-supported-devices-filter-menu'
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

        <div className='seam-supported-devices-filter-area-search-bar-wrap'>
          <div className='adornment seam-icon-adornment'>
            <SearchIcon />
          </div>

          <TextField
            placeholder='Search...'
            value={filterValue}
            onChange={(value) => {
              setFilterValue(value)
            }}
            className='seam-supported-devices-filter-area-search-bar'
          />

          {filterValue.trim() !== '' && (
            <div className='adornment seam-clear-button-adornment'>
              <button
                onClick={() => {
                  setFilterValue('')
                }}
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
