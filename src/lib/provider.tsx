import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, type ReactElement, type ReactNode, useRef } from 'react'
import { Seam } from 'seamapi'

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

export function SeamProvider({
  children,
  ...props
}: SeamProviderProps): ReactElement {
  const { Provider } = seamContext

  const queryClientRef = useRef(new QueryClient())

  const contextRef = useRef(createSeamContextValue(props))
  if (contextRef.current.client == null) {
    contextRef.current = defaultSeamContextValue
  }

  if (contextRef.current.client == null) {
    throw new Error(
      'Must provide either a Seam client or a publishableKey and a sessionKey.'
    )
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Provider value={{ ...contextRef.current }}>{children}</Provider>
    </QueryClientProvider>
  )
}

const createDefaultSeamContextValue = (): SeamContext => {
  if (
    globalThis.seam?.client == null &&
    globalThis.seam?.publishableKey == null
  ) {
    return { client: null }
  }

  try {
    return createSeamContextValue(globalThis.seam)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return { client: null }
  }
}

const createSeamContextValue = ({
  client,
  ...options
}: Omit<SeamProviderProps, 'children'>): SeamContext => {
  if (client == null && Object.keys(options).length === 0) {
    return { client: null }
  }

  if (client != null && Object.values(options).some((v) => v == null)) {
    throw new Error(
      'Cannot provide both a Seam client along with a publishableKey, sessionKey, or endpoint.'
    )
  }

  return {
    client: client ?? new Seam(options)
  }
}

const defaultSeamContextValue = createDefaultSeamContextValue()

export const seamContext = createContext<SeamContext>(defaultSeamContextValue)
