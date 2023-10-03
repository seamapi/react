import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { CheckGreenIcon } from 'lib/icons/CheckGreen.js'
import { CloseWhiteIcon } from 'lib/icons/CloseWhite.js'
import { ExclamationCircleIcon } from 'lib/icons/ExclamationCircle.js'

type SnackbarVariant = 'success' | 'error'

interface SnackbarProps {
  message: string
  variant: SnackbarVariant
  visible: boolean
  action?: {
    label: string
    onClick: () => void
  }
  autoDismiss?: boolean
  dismissAfterMs?: number
  disableCloseButton?: boolean
}

export function Snackbar({
  message,
  variant,
  visible,
  action,
  autoDismiss = false,
  dismissAfterMs = 5000,
  disableCloseButton = false,
}: SnackbarProps): JSX.Element {
  const [hidden, setHidden] = useState(visible)

  const { label: actionLabel, onClick: handleActionClick } = action ?? {}

  useEffect(() => {
    setHidden(!visible)
  }, [visible])

  useEffect(() => {
    if (!autoDismiss) {
      return () => {}
    }

    const timeout = globalThis.setTimeout(() => {
      setHidden(false)
    }, dismissAfterMs)

    return () => {
      globalThis.clearTimeout(timeout)
    }
  }, [autoDismiss, dismissAfterMs])

  return (
    <div className='seam-snackbar-wrap'>
      <div
        className={classNames('seam-snackbar', {
          'seam-snackbar-hide': hidden,
        })}
      >
        <SnackbarIcon variant={variant} />
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
              onClick={() => { setHidden(true); }}
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
