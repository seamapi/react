import { SnackbarProvider as NotistackProvider, useSnackbar } from 'notistack'
import { type PropsWithChildren, useCallback } from 'react'

import { Snackbar, type SnackbarProps } from 'lib/ui/Snackbar/Snackbar.js'

export function SnackbarProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <NotistackProvider
      maxSnack={3}
      Components={{
        default: Snackbar,
        error: Snackbar,
        success: Snackbar,
        warning: Snackbar,
        info: Snackbar,
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      {children}
    </NotistackProvider>
  )
}

export const useShowSnackbar = (): (({
  message,
  ...otherProps
}: Pick<SnackbarProps, 'message'> &
  Partial<Omit<SnackbarProps, 'message'>>) => void) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const show = useCallback(
    ({
      message,
      ...otherProps
    }: Pick<SnackbarProps, 'message'> &
      Partial<Omit<SnackbarProps, 'message'>>) => {
      enqueueSnackbar(message, {
        close: (id: number) => {
          closeSnackbar(id)
        },
        autoHideDuration: 5000,
        ...otherProps,
      })
    },
    [closeSnackbar, enqueueSnackbar]
  )
  return show
}
