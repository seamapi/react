import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'

import { CheckGreenIcon } from 'lib/icons/CheckGreen.js'
import { CloseWhiteIcon } from 'lib/icons/CloseWhite.js'
import { ExclamationCircleIcon } from 'lib/icons/ExclamationCircle.js'

export type SnackbarVariant = 'success' | 'error'

export interface SnackbarProps {
  message: string
  variant: SnackbarVariant
  visible: boolean
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  autoDismiss?: boolean
  dismissAfterMs?: number
  disableCloseButton?: boolean
  automaticVisibility?: boolean
}

export function Snackbar({
  message,
  variant,
  visible,
  action,
  autoDismiss = false,
  dismissAfterMs = 5000,
  disableCloseButton = false,
  automaticVisibility = false,
  onClose = () => {},
}: SnackbarProps): JSX.Element {
  const [hidden, setHidden] = useState(visible)

  useEffect(() => {
    setHidden(!visible)
  }, [visible, setHidden])

  const { label: actionLabel, onClick: handleActionClick } = action ?? {}

  const handleClose = useCallback(() => {
    setHidden(true)
    onClose()
  }, [onClose, setHidden])

  useEffect(() => {
    if (!autoDismiss) {
      return () => {}
    }

    const timeout = globalThis.setTimeout(() => {
      handleClose()
    }, dismissAfterMs)

    return () => {
      globalThis.clearTimeout(timeout)
    }
  }, [autoDismiss, dismissAfterMs, handleClose])

  return (
    <div className='seam-snackbar-wrap'>
      <div
        className={classNames('seam-snackbar', {
          'seam-snackbar-visible': automaticVisibility ? !hidden : visible,
        })}
      >
        <span className='seam-snackbar-icon-wrap'>
          <SnackbarIcon variant={variant} />
        </span>

        <div className='seam-snackbar-message-wrap'>
          <p className='seam-snackbar-message'>{message}</p>
        </div>
        <div className='seam-snackbar-actions-wrap'>
          {action != null && (
            <button
              className='seam-snackbar-action'
              onClick={handleActionClick}
            >
              <span className='seam-snackbar-action-label'>{actionLabel}</span>
            </button>
          )}
          {!disableCloseButton && (
            <button
              className='seam-snackbar-close-button'
              onClick={() => {
                handleClose()
              }}
            >
              <CloseWhiteIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SnackbarIcon(props: { variant: SnackbarVariant }): JSX.Element {
  switch (props.variant) {
    case 'success':
      return <CheckGreenIcon />
    case 'error':
      return <ExclamationCircleIcon />
  }
}
