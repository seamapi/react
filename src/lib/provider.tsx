import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, type ReactElement, type ReactNode } from 'react'

// import { Seam } from 'seamapi'
import { Seam } from 'lib/seam-client-stub.js'

declare global {
  // eslint-disable-next-line no-var
  var seam: Omit<SeamProviderProps, 'children'> | undefined
}

export interface SeamContext {
  client: Seam | null
}

export interface SeamProviderProps {
  client?: Seam
  publishableKey?: string
  sessionKey?: string
  endpoint?: string
  children?: ReactNode
}

const queryClient = new QueryClient()

export function SeamProvider({
  children,
  ...props
}: SeamProviderProps): ReactElement {
  const { Provider } = seamContext
  const client = getClient(props)
  return (
    <QueryClientProvider client={queryClient}>
      <Provider value={{ client }}>{children}</Provider>
    </QueryClientProvider>
  )
}

const createDefaultSeamContext = (): SeamContext => {
  if (
    globalThis.seam?.client == null &&
    globalThis.seam?.publishableKey == null
  ) {
    return { client: null }
  }

  try {
    const client = getClient(globalThis.seam)
    return { client }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return { client: null }
  }
}

const getClient = ({
  client,
  ...options
}: Omit<SeamProviderProps, 'children'>): Seam => {
  if (client != null && Object.values(options).some((v) => v == null)) {
    throw new Error(
      'Cannot provide both a Seam client along with a publishableKey, sessionKey, or endpoint.'
    )
  }

  if (client == null && Object.keys(options).length === 0) {
    throw new Error(
      'Must provide either a Seam client or a publishableKey and a sessionKey.'
    )
  }

  return client ?? new Seam(options)
}

export const seamContext = createContext<SeamContext>(
  createDefaultSeamContext()
)
