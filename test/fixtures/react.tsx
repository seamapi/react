import { SeamProvider } from '@seamapi/react'
import { render } from '@testing-library/react'
import type { PropsWithChildren } from 'react'

declare global {
  // eslint-disable-next-line no-var
  var JEST_SEAM_ENDPOINT: string
  // eslint-disable-next-line no-var
  var JEST_SEAM_PUBLISHABLE_KEY_1: string
  // eslint-disable-next-line no-var
  var JEST_SEAM_PUBLISHABLE_KEY_2: string
  // eslint-disable-next-line no-var
  var JEST_SEAM_CLIENT_SESSION_TOKEN_2: string
}

function Providers({ children }: PropsWithChildren): JSX.Element {
  return (
    <SeamProvider
      endpoint={globalThis.JEST_SEAM_ENDPOINT}
      publishableKey={globalThis.JEST_SEAM_PUBLISHABLE_KEY_1}
      userIdentifierKey='some_user'
      disableCssInjection
      disableFontInjection
    >
      {children}
    </SeamProvider>
  )
}

type Render = typeof render

const customRender = (
  ui: Parameters<Render>[0],
  options?: Parameters<Render>[1]
): ReturnType<Render> => render(ui, { wrapper: Providers, ...options })

// eslint-disable-next-line import/export
export * from '@testing-library/react'
// eslint-disable-next-line import/export
export { customRender as render }
