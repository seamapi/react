import { CloseIcon } from 'lib/icons/Close.js'
import { SearchIcon } from 'lib/icons/Search.js'
import { Button } from 'lib/ui/Button.js'
import Menu from 'lib/ui/Menu/Menu.js'
import type { Filters } from 'lib/ui/SupportedDevices/types.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import type { Dispatch, SetStateAction } from 'react'

interface SupportedDevicesFilterAreaProps {
  filterStr: string
  setFilterStr: (filterStr: string) => void
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

export default function SupportedDevicesFilterArea({
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
            onClick={(ev) => ev.stopPropagation()}
          >
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
                  onChange={(ev) =>
                    setFilters((f) => ({
                      ...f,
                      supportedOnly: ev.target.checked,
                    }))
                  }
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
            onChange={(value) => setFilterStr(value)}
            className='seam-supported-devices-filter-area-search-bar'
          />

          {filterStr.trim() !== '' && (
            <div className='adornment seam-clear-button-adornment'>
              <button onClick={() => setFilterStr('')}>
                <CloseIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
