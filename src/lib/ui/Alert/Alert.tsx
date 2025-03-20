import classNames from 'classnames'
import type { MouseEventHandler } from 'react'

import { ExclamationCircleIcon } from 'lib/icons/ExclamationCircle.js'
import { TriangleWarningIcon } from 'lib/icons/TriangleWarning.js'

export interface AlertProps {
  variant: 'warning' | 'error'
  message: string
  action?: ActionProps
  className?: string
}

interface ActionProps {
  label: string
  onClick: MouseEventHandler
}

export function Alert(props: AlertProps): JSX.Element {
  const { variant, message, className } = props

  return (
    <div
      className={classNames('seam-alert', `seam-${variant}-alert`, className)}
    >
      <div className='seam-alert-content'>
        <div className='seam-alert-icon-wrap'>
          <div className='seam-alert-icon'>
            {variant === 'warning' ? (
              <TriangleWarningIcon />
            ) : (
              <ExclamationCircleIcon />
            )}
          </div>
        </div>
        <div className='seam-alert-message-wrap'>
          <p className='seam-alert-message'>{message}</p>
        </div>
      </div>
      {props.action != null && <Action {...props.action} />}
    </div>
  )
}

function Action(props: ActionProps): JSX.Element | null {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    props.onClick(event)
  }

  return (
    <div className='seam-alert-action-wrap'>
      <button type='button' onClick={handleClick} className='seam-alert-action'>
        {props.label}
      </button>
    </div>
  )
}
