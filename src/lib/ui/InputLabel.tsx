import classNames from 'classnames'
import type { ReactNode } from 'react'

interface InputLabelProps {
  children: ReactNode
  className?: string
}

export function InputLabel({ children, className }: InputLabelProps) {
  return (
    <div className={classNames('seam-input-label', className)}>{children}</div>
  )
}
