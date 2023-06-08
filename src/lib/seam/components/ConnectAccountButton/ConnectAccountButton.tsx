import { useCallback } from 'react'

import { useCreateConnectWebview } from 'lib/seam/connect-webviews/use-create-connect-webview.js'
import { Button } from 'lib/ui/Button.js'

export interface ConnectAccountButtonProps {
  className?: string
}

export function ConnectAccountButton({
  className,
}: ConnectAccountButtonProps = {}): JSX.Element {
  const { isLoading, mutate } = useCreateConnectWebview({
    willNavigateToWebview: true,
  })

  const url = window.location.href
  const handleClick = useCallback(() => {
    mutate({
      custom_redirect_url: url,
      custom_redirect_failure_url: url,
    })
  }, [mutate, url])

  return (
    <Button
      size='small'
      onClick={handleClick}
      className={className}
      disabled={isLoading}
    >
      {t.connectAccount}
    </Button>
  )
}

const t = {
  connectAccount: 'Connect Account',
}
