import classNames from 'classnames'

interface ButtonProps {
  children?: string
  variant?: 'solid' | 'outline' | 'neutral'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

export function Button({
  variant = 'outline',
  children,
  size = 'medium',
  disabled,
}: ButtonProps) {
  return (
    <button
      className={classNames(`seam-btn seam-btn-${variant} seam-btn-${size}`, {
        'seam-btn-disabled': disabled,
      })}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
