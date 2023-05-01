import classNames from 'classnames'

import type { DivProps } from 'lib/ui/types.js'

export function TableCell({ className, ...otherProps }: DivProps) {
  return (
    <div
      className={classNames('seam--table-cell', className)}
      {...otherProps}
    />
  )
}
