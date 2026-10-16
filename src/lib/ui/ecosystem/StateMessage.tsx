import type { PropsWithChildren } from 'react'

interface StateMessageProps extends PropsWithChildren {
  actionLabel?: string
  onAction?: () => void
  role?: 'status' | 'alert'
}

export function StateMessage({
  children,
  actionLabel,
  onAction,
  role = 'status',
}: StateMessageProps): JSX.Element {
  return (
    <div className='seam-ecosystem-message' role={role}>
      <p>{children}</p>
      {actionLabel != null && onAction != null && (
        <button
          type='button'
          className='seam-ecosystem-button'
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
