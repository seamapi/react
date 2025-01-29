import { useCallback, useState } from 'react'

import { Snackbar, type SnackbarProps } from 'lib/ui/Snackbar/Snackbar.js'

export interface UseToggleLockSnackbarContext {
  showToggleSnackbar: (type: SnackbarProps['variant']) => void
  renderSnackbar: () => JSX.Element
}

export function useToggleLockSnackbar(): UseToggleLockSnackbarContext {
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState<SnackbarProps['variant']>('success')

  return {
    showToggleSnackbar: useCallback((type) => {
      setVariant(type)
      setVisible(true)
    }, []),
    renderSnackbar: useCallback(() => {
      return (
        <Snackbar
          variant={variant}
          visible={visible}
          onClose={() => {
            setVisible(false)
          }}
          message={
            variant === 'success' ? t.successfullyUpdated : t.failedToUpdate
          }
          autoDismiss
        />
      )
    }, [visible, variant]),
  }
}

const t = {
  successfullyUpdated: 'Lock status has been successfully updated',
  failedToUpdate: 'Failed to update lock status',
}
