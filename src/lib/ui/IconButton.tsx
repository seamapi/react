import classNames from 'classnames'

import type { ButtonProps } from 'lib/ui/types.js'

export function IconButton({ className, ...props }: ButtonProps): JSX.Element {
  return (
    <button {...props} className={classNames('seam-icon-btn', className)} />
  )
}
