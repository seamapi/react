import classNames from 'classnames'

import type { SpanProps } from 'lib/ui/types.js'

export function Title({
  children,
  className,
  ...props
}: SpanProps): JSX.Element {
  return (
    <span className={classNames('seam-title', className)} {...props}>
      {children}
    </span>
  )
}
