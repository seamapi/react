import classNames from 'classnames'
import type { MouseEventHandler, PropsWithChildren } from 'react'

interface ButtonProps {
  variant?: 'solid' | 'outline' | 'neutral'
  size?: 'small' | 'medium' | 'large'
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
}: PropsWithChildren<ButtonProps>): JSX.Element {
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
    >
      {children}
    </button>
  )
}
