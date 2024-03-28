import { useCallback } from 'react'

import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { useCreateConnectWebview } from 'lib/seam/connect-webviews/use-create-connect-webview.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'
import { Button } from 'lib/ui/Button.js'

export interface ConnectAccountButtonProps extends CommonProps {}

export const NestedConnectAccountButton =
  withRequiredCommonProps(ConnectAccountButton)

export function ConnectAccountButton({
  className,
}: ConnectAccountButtonProps = {}): JSX.Element {
  useComponentTelemetry('ConnectAccountButton')

  const { isLoading, mutate } = useCreateConnectWebview({
    willNavigateToWebview: true,
  })

  const handleClick = useCallback(() => {
    mutate({
      custom_redirect_url: globalThis.location?.href,
      wait_for_device_creation: true,
    })
  }, [mutate])

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
