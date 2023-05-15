import classNames from 'classnames'

interface ButtonProps {
  children?: string
  variant?: 'solid' | 'outline' | 'neutral'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
}

export function Button({
  variant = 'outline',
  children,
  size = 'medium',
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      className={classNames(`seam-btn seam-btn-${variant} seam-btn-${size}`, {
        'seam-btn-disabled': disabled,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
