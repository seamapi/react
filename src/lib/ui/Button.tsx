import classNames from 'classnames'
import type { MouseEventHandler } from 'react'

interface ButtonProps {
  children?: React.ReactNode
  variant?: 'solid' | 'outline' | 'neutral'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

export function Button({
  variant = 'outline',
  children,
  size = 'medium',
  disabled,
  onClick,
  className,
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
    >
      {children}
    </button>
  )
}
