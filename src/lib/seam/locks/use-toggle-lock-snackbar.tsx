import { useCallback, useMemo, useState } from 'react'

import { Snackbar, type SnackbarVariant } from 'lib/ui/Snackbar/Snackbar.js'

export interface UseToggleLockSnackbarContext {
  showToggleSnackbar: (variant: SnackbarVariant) => void
  ToggleLockSnackbarNode: JSX.Element
}

export function useToggleLockSnackbar(): UseToggleLockSnackbarContext {
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState<SnackbarVariant>('success')

  const ToggleLockSnackbarNode = useMemo(
    () => (
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
    ),
    [visible, variant]
  )

  return {
    showToggleSnackbar: useCallback((variant) => {
      setVariant(variant)
      setVisible(true)
    }, []),
    ToggleLockSnackbarNode,
  }
}

const t = {
  successfullyUpdated: 'Lock status has been successfully updated',
  failedToUpdate: 'Failed to update lock status',
}
