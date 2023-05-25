import { ArrowRestartIcon } from 'lib/icons/ArrowRestart.js'
import { IconButton } from 'lib/ui/IconButton.js'
import type { ButtonProps, DivProps } from 'lib/ui/types.js'

export interface TableFiltersProps extends DivProps {
  hasSelectedFilter?: boolean
  onClearFilter?: () => void
}

export function TableFilterBar({
  hasSelectedFilter,
  onClearFilter,
  children,
  ...props
}: TableFiltersProps) {
  return (
    <div className='seam-table-filter-bar' {...props}>
      {children}{' '}
      {hasSelectedFilter === true && (
        <ClearFiltersButton onClick={onClearFilter} />
      )}
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
