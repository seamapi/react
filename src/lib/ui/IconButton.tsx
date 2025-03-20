import classNames from 'classnames'
import type { Ref } from 'react'

import type { ButtonProps } from 'lib/ui/types.js'

export type IconProps = ButtonProps & {
  elRef?: Ref<HTMLButtonElement>
}

export function IconButton({
  className,
  elRef,
  ...props
}: IconProps): JSX.Element {
  return (
    <button
      {...props}
        type='button'
      ref={elRef}
      className={classNames(
        'seam-icon-btn',
        props.disabled === true && 'seam-icon-btn-disabled',
        className
      )}
    />
  )
}
