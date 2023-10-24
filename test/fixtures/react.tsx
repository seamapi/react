import { SeamProvider } from '@seamapi/react'
import { QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { PropsWithChildren } from 'react'

import type { ApiTestContext } from './api.js'

type Render = typeof render

const customRender = (
  ui: Parameters<Render>[0],
  { endpoint, seed, ...options }: Parameters<Render>[1] & ApiTestContext
): ReturnType<Render> => {
  const queryClient = createQueryClient()
  const Providers = createProviders({
    queryClient,
    endpoint,
    publishableKey: seed.seam_pk1_token,
    userIdentifierKey: seed.john_user_identifier_key,
  })
  return render(ui, { wrapper: Providers, ...options })
}

const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const createProviders = ({
  endpoint,
  publishableKey,
  userIdentifierKey,
  queryClient,
}: {
  endpoint: string
  publishableKey: string
  userIdentifierKey: string
  queryClient: QueryClient
}) => {
  return function Providers({ children }: PropsWithChildren): JSX.Element {
    return (
      <SeamProvider
        queryClient={queryClient}
        endpoint={endpoint}
        publishableKey={publishableKey}
        userIdentifierKey={userIdentifierKey}
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
