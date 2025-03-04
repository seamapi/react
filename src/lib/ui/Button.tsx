import classNames from 'classnames'
import type { MouseEventHandler, PropsWithChildren } from 'react'

import { Spinner } from 'lib/ui/Spinner/Spinner.js'

interface ButtonProps extends PropsWithChildren {
  variant?: 'solid' | 'outline' | 'neutral' | 'danger'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
  loading?: boolean
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
  loading = false,
  
}: ButtonProps): JSX.Element {
  return (
    <button
      className={classNames(
        `seam-btn seam-btn-${variant} seam-btn-${size}`,
        {
          'seam-btn-disabled': disabled,
          'seam-btn-loading': loading,
        },
        className
      )}
      disabled={disabled}
      onClick={(e) => {
        if (loading || disabled) {
          e.preventDefault();
          return;
        }

        onClick?.(e);
      }}
      onMouseDown={onMouseDown}
      type={type}
    >
      <span className='seam-btn-content'>{children}</span>
      {
        loading && (
          <div className='seam-btn-loading'>
            <Spinner size='small' />
          </div>
        )
      }
    </button>
  )
}
