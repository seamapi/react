import { CloseIcon } from 'lib/icons/Close.js'
import { SearchIcon } from 'lib/icons/Search.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

interface SupportedDevicesFilterAreaProps {
  filterStr: string
  setFilterStr: (filterStr: string) => void
}

export default function SupportedDevicesFilterArea({
  filterStr,
  setFilterStr,
}: SupportedDevicesFilterAreaProps) {
  return (
    <div className='seam-supported-devices-filter-area'>
      <div className='seam-deliberate-block' />
      <div className='seam-filters-wrap'>
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
