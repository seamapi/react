import classNames from 'classnames'

import { CheckGreenIcon } from 'lib/icons/CheckGreen.js'
import { CloseWhiteIcon } from 'lib/icons/CloseWhite.js'
import { ExclamationCircleIcon } from 'lib/icons/ExclamationCircle.js'
import { useEffect } from 'react'

const AUTO_DISMISS_MS = 5000

type SnackbarVariant = 'success' | 'error'

interface SnackbarProps {
  message: string
  variant: SnackbarVariant
  isOpen: boolean
  onClose: () => void
  action?: {
    label: string
    onClick: () => void
  }
  autoDismiss?: boolean
}

export function Snackbar({
  message,
  variant,
  isOpen,
  onClose,
  action,
  autoDismiss = false,
}: SnackbarProps) {
  useEffect(() => {
    if (!autoDismiss) {
      return () => {}
    }

    const timeout = globalThis.setTimeout(() => {
      onClose()
    }, AUTO_DISMISS_MS)

    return () => {
      globalThis.clearTimeout(timeout)
    }
  })

  return (
    <div
      className={classNames('seam-snackbar', {
        'seam-snackbar-hide': !isOpen,
      })}
    >
      {SnackbarIcon(variant)}
      <div className='seam-snackbar-message-wrap'>
        <p className='seam-snackbar-message'>{message}</p>
      </div>
      <div className='seam-snackbar-actions-wrap'>
        {action && (
          <button className='seam-snackbar-action' onClick={action.onClick}>
            <span className='seam-snackbar-action-label'>{action.label}</span>
          </button>
        )}
        <button className='seam-snackbar-close-button' onClick={onClose}>
          <CloseWhiteIcon />
        </button>
      </div>
    </div>
  )
}

function SnackbarIcon(variant: SnackbarVariant): JSX.Element {
  switch (variant) {
    case 'success':
      return <CheckGreenIcon />
    case 'error':
      return <ExclamationCircleIcon />
  }
}
