import classNames from 'classnames'

import type { DivProps } from 'lib/ui/types.js'

export function TableCell({ className, ...props }: DivProps): JSX.Element {
  return <div className={classNames('seam-table-cell', className)} {...props} />
}
