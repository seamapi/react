import classNames from 'classnames'
import type { MouseEventHandler } from 'react'

import { ExclamationCircleIcon } from 'lib/icons/ExclamationCircle.js'
import { WarningIcon } from 'lib/icons/Warning.js'

export interface AlertProps {
  variant: 'warning' | 'error'
  message: string
  action?: {
    label: string
    onClick: MouseEventHandler
  }
  className?: string
}

export function Alert(props: AlertProps): JSX.Element {
  const { variant, message, action, className, ...rest } = props

  if (!variant) {
    throw new Error('Alert must have a variant')
  }

  if (action != null) {
    if (!action.label) {
      throw new Error('Alert action must have a label')
    }

    if (!action.onClick) {
      throw new Error('Alert action must have an onClick handler')
    }
  }

  return (
    <div
      className={classNames('seam-alert', `seam-${variant}-alert`, className)}
      {...rest}
    >
      <div className='seam-alert-content'>
        <div className='seam-alert-icon'>
          {variant === 'warning' ? <WarningIcon /> : <ExclamationCircleIcon />}
        </div>

        <div className='seam-alert-message-wrap'>
          <p className='seam-alert-message'>{message}</p>
        </div>
      </div>

      {action != null && (
        <div className='seam-alert-action-wrap'>
          <button onClick={action.onClick} className='seam-alert-action'>
            {action.label}
          </button>
        </div>
      )}
    </div>
  )
}
