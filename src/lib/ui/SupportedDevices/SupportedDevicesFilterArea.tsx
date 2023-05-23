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
        <TextField
          placeholder='Search...'
          value={filterStr}
          onChange={(value) => setFilterStr(value)}
        />
      </div>
    </div>
  )
}
