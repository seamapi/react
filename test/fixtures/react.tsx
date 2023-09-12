import { SeamProvider } from '@seamapi/react'
import { QueryClient } from '@tanstack/react-query'
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

type Render = typeof render

const customRender = (
  ui: Parameters<Render>[0],
  options?: Parameters<Render>[1]
): ReturnType<Render> => {
  const queryClient = createQueryClient()
  const Providers = createProviders({ queryClient })
  return render(ui, { wrapper: Providers, ...options })
}

const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // UPSTREAM: Prevent "Jest did not exit one second after the test run completed" error message.
        // https://tanstack.com/query/v4/docs/react/guides/testing#set-cachetime-to-infinity-with-jest
        cacheTime: Infinity,
      },
    },
  })

const createProviders = ({ queryClient }: { queryClient: QueryClient }) => {
  return function Providers({ children }: PropsWithChildren): JSX.Element {
    return (
      <SeamProvider
        queryClient={queryClient}
        endpoint={globalThis.JEST_SEAM_ENDPOINT}
        publishableKey={globalThis.JEST_SEAM_PUBLISHABLE_KEY_1}
        userIdentifierKey='some_user'
        disableTelemetry
        disableCssInjection
        disableFontInjection
      >
        {children}
      </SeamProvider>
    )
  }
}

// eslint-disable-next-line import/export
export * from '@testing-library/react'
// eslint-disable-next-line import/export
export { customRender as render }
