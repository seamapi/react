import { CheckGreenIcon } from 'lib/icons/CheckGreen.js'
import { CloseWhiteIcon } from 'lib/icons/CloseWhite.js'
import { ExclamationCircleIcon } from 'lib/icons/ExclamationCircle.js'

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
}

export function Snackbar({
  message,
  variant,
  isOpen,
  onClose,
  action,
}: SnackbarProps) {
  return (
    <div className='seam-snackbar'>
      {SnackbarIcon(variant)}
      <div className='seam-snackbar-message-wrap'>
        <p className='seam-snackbar-message'>{message}</p>S
      </div>
      {action && (
        <button className='seam-snackbar-action' onClick={action.onClick}>
          <span className='seam-snackbar-action-label'>{action.label}</span>
        </button>
      )}
      <button className='seam-snackbar-close-button' onClick={onClose}>
        <CloseWhiteIcon />
      </button>
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
