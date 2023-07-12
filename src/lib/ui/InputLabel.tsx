import classNames from 'classnames'
import { forwardRef, type ReactNode } from 'react'

interface InputLabelProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const InputLabel = forwardRef<HTMLDivElement, InputLabelProps>(
  function InputLabel({ children, className, onClick }, ref) {
    return (
      <div
        className={classNames('seam-input-label', className)}
        ref={ref}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }
)
