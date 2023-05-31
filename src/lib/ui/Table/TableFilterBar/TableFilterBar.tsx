import { ArrowRestartIcon } from 'lib/icons/ArrowRestart.js'
import { IconButton } from 'lib/ui/IconButton.js'
import type { ButtonProps, DivProps } from 'lib/ui/types.js'

interface TableFilterBarProps extends DivProps {
  filterCleared?: boolean
  onFilterClear?: () => void
}

export function TableFilterBar({
  filterCleared = false,
  onFilterClear,
  children,
  ...props
}: TableFilterBarProps): JSX.Element {
  return (
    <div className='seam-table-filter-bar' {...props}>
      {children}{' '}
      {!filterCleared && <ClearFiltersButton onClick={onFilterClear} />}
    </div>
  )
}

function ClearFiltersButton(props: ButtonProps): JSX.Element {
  return (
    <IconButton {...props} className='seam-clear-filters-button'>
      <ArrowRestartIcon />
    </IconButton>
  )
}
