import classNames from 'classnames'
import type { MouseEventHandler, PropsWithChildren } from 'react'

interface ButtonProps extends PropsWithChildren {
  variant?: 'solid' | 'outline' | 'neutral'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
}

export function Button({
  variant = 'outline',
  children,
  size = 'medium',
  disabled = false,
  onClick,
  className,
  onMouseDown,
  type = 'button',
}: ButtonProps): JSX.Element {
  return (
    <button
      className={classNames(
        `seam-btn seam-btn-${variant} seam-btn-${size}`,
        {
          'seam-btn-disabled': disabled,
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      type={type}
    >
      {children}
    </button>
  )
}
