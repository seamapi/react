import classNames from 'classnames'

import type { DivProps } from 'lib/ui/types.js'

export interface TableFilterItemProps extends DivProps {
  selected?: boolean
}

export function TableFilterItem({
  onClick,
  selected,
  ...props
}: TableFilterItemProps) {
  return (
    <div
      onClick={onClick}
      className={classNames('seam-table-filter-item', {
        'seam-clickable': onClick !== undefined,
        'seam-selected': selected,
      })}
      {...props}
    />
  )
}
