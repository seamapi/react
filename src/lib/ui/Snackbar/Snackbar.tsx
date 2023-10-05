import type { SnackbarProviderProps } from 'notistack'
import { forwardRef } from 'react'

import { CheckGreenIcon } from 'lib/icons/CheckGreen.js'
import { CloseWhiteIcon } from 'lib/icons/CloseWhite.js'
import { ExclamationCircleIcon } from 'lib/icons/ExclamationCircle.js'

type SnackbarVariant = 'success' | 'error'

export interface SnackbarProps
  extends Pick<SnackbarProviderProps, 'autoHideDuration'> {
  id: number | string
  close: (id: number | string) => void
  message: string
  variant: SnackbarVariant
  action?: string
  onActionClick?: () => void
  disableCloseButton?: boolean
}
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  function Snackbar(
    {
      message,
      variant,
      action,
      onActionClick,
      disableCloseButton = false,
      id,
      close,
    }: SnackbarProps,
    ref
  ): JSX.Element {
    return (
      <div className='seam-snackbar-wrap' ref={ref}>
        <div className='seam-snackbar'>
          <SnackbarIcon variant={variant} />
          <div className='seam-snackbar-message-wrap'>
            <p className='seam-snackbar-message'>{message}</p>
          </div>
          <div className='seam-snackbar-actions-wrap'>
            {action != null && onActionClick != null && (
              <button className='seam-snackbar-action' onClick={onActionClick}>
                <span className='seam-snackbar-action-label'>{action}</span>
              </button>
            )}
            {!disableCloseButton && (
              <button
                className='seam-snackbar-close-button'
                onClick={() => {
                  close(id)
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
)

function SnackbarIcon(props: { variant: SnackbarVariant }): JSX.Element {
  switch (props.variant) {
    case 'success':
      return <CheckGreenIcon />
    case 'error':
      return <ExclamationCircleIcon />
  }
}
