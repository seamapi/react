import { ArrowRestartIcon } from 'lib/icons/ArrowRestart.js'
import { IconButton } from 'lib/ui/IconButton.js'
import type { ButtonProps, DivProps } from 'lib/ui/types.js'

export interface TableFiltersProps extends DivProps {
  isFilterCleared?: boolean
  onFilterClear?: () => void
}

export function TableFilterBar({
  isFilterCleared,
  onFilterClear,
  children,
  ...props
}: TableFiltersProps) {
  const showClearFilterButton = isFilterCleared === false
  return (
    <div className='seam-table-filter-bar' {...props}>
      {children}{' '}
      {showClearFilterButton && <ClearFiltersButton onClick={onFilterClear} />}
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
