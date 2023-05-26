import classNames from 'classnames'

import type { DivProps } from 'lib/ui/types.js'

interface TableFilterItemProps extends DivProps {
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
        'seam-clickable': onClick != null,
        'seam-selected': selected,
      })}
      {...props}
    />
  )
}
