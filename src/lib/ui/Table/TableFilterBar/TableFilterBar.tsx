import { ArrowRestartIcon } from 'lib/icons/ArrowRestart.js'
import { IconButton } from 'lib/ui/IconButton.js'
import type { ButtonProps, DivProps } from 'lib/ui/types.js'

interface TableFilterBarProps extends DivProps {
  isFilterCleared?: boolean
  onFilterClear?: () => void
}

export function TableFilterBar({
  isFilterCleared = false,
  onFilterClear,
  children,
  ...props
}: TableFilterBarProps) {
  return (
    <div className='seam-table-filter-bar' {...props}>
      {children}{' '}
      {!isFilterCleared && <ClearFiltersButton onClick={onFilterClear} />}
    </div>
  )
}

function ClearFiltersButton(props: ButtonProps) {
  return (
    <IconButton {...props} className='seam-clear-filters-button'>
      <ArrowRestartIcon />
    </IconButton>
  )
}
