import { capitalize } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'

import { CloseIcon } from 'lib/icons/Close.js'
import { SearchIcon } from 'lib/icons/Search.js'
import { Button } from 'lib/ui/Button.js'
import Menu from 'lib/ui/Menu/Menu.js'
import FilterCategoryMenu from 'lib/ui/SupportedDevices/FilterCategoryMenu.js'
import type { DeviceModel, Filters } from 'lib/ui/SupportedDevices/types.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

interface SupportedDevicesFilterAreaProps {
  deviceModels: DeviceModel[]
  filterStr: string
  setFilterStr: (filterStr: string) => void
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

export default function SupportedDevicesFilterArea({
  deviceModels,
  filterStr,
  setFilterStr,
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

  function getAvailablePropertiesFromDeviceModels(property: keyof DeviceModel) {
    const properties = new Set<string>()
    deviceModels.forEach((deviceModel) => {
      properties.add(capitalize(deviceModel[property]))
    })
    return Array.from(properties)
  }

  function resetFilter(filterType: keyof Filters) {
    setFilters((filters) => ({
      ...filters,
      [filterType]: null,
    }))
  }

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
              Filter
              {appliedFiltersCount !== 0 ? `s (${appliedFiltersCount})` : ''}
            </Button>
          )}
        >
          <div
            className='seam-supported-devices-filter-menu'
            onClick={(ev) => {
              ev.stopPropagation()
            }}
          >
            {/* <div className='seam-filter-menu-row'>
              <FilterCategoryMenu
                label='Category'
                options={getAvailablePropertiesFromDeviceModels(
                  'main_category'
                )}
                buttonLabel={filters.category ?? 'All'}

                // TODO: Uncomment this when the filter is implemented—not
                // hard coded—on the backend
                //
                // onSelect={(category: string) => {
                //   setFilters((filters) => ({
                //     ...filters,
                //     category,
                //   }))
                // }}
              />
            </div> */}

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
                  onChange={(ev) => {
                    setFilters((filters) => ({
                      ...filters,
                      supportedOnly: ev.target.checked,
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
            value={filterStr}
            onChange={(value) => {
              setFilterStr(value)
            }}
            className='seam-supported-devices-filter-area-search-bar'
          />

          {filterStr.trim() !== '' && (
            <div className='adornment seam-clear-button-adornment'>
              <button
                onClick={() => {
                  setFilterStr('')
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
