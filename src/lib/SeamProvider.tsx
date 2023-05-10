'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import type { Seam, SeamClientOptions } from 'seamapi'

declare global {
  // eslint-disable-next-line no-var
  var seam: SeamProviderProps | undefined
}

export interface SeamContext {
  client: Seam | null
  clientOptions?: AllowedSeamClientOptions | undefined
  publishableKey?: string | undefined
  userIdentifierKey?: string | undefined
  clientSessionToken?: string | undefined
}

type SeamProviderProps =
  | SeamProviderPropsWithClient
  | (SeamProviderPropsWithPublishableKey & AllowedSeamClientOptions)
  | (SeamProviderPropsWithClientSessionToken & AllowedSeamClientOptions)

interface SeamProviderPropsWithClient {
  client: Seam
}

interface SeamProviderPropsWithPublishableKey {
  publishableKey: string
  userIdentifierKey?: string
}

interface SeamProviderPropsWithClientSessionToken {
  clientSessionToken: string
}

type AllowedSeamClientOptions = Pick<SeamClientOptions, 'endpoint'>

export function SeamProvider({
  children,
  ...props
}: PropsWithChildren<SeamProviderProps>): JSX.Element {
  const { Provider } = seamContext

  const queryClientRef = useRef(new QueryClient())

  const contextRef = useRef(createSeamContextValue(props))
  if (
    contextRef.current.client == null &&
    contextRef.current.publishableKey == null
  ) {
    contextRef.current = defaultSeamContextValue
  }

  if (
    contextRef.current.client == null &&
    contextRef.current.publishableKey == null
  ) {
    throw new Error('Must provide either a Seam client or a publishableKey.')
  }

  return (
    <div className='seam-components'>
      <QueryClientProvider client={queryClientRef.current}>
        <Provider value={{ ...contextRef.current }}>{children}</Provider>
      </QueryClientProvider>
    </div>
  )
}

const createDefaultSeamContextValue = (): SeamContext => {
  if (globalThis.seam == null) {
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

const createSeamContextValue = (options: SeamProviderProps): SeamContext => {
  if (isSeamProviderPropsWithClient(options)) {
    return options
  }

  if (isSeamProviderPropsWithClientSessionToken(options)) {
    const { clientSessionToken, ...clientOptions } = options
    return {
      clientSessionToken,
      clientOptions,
      client: null,
    }
  }

  if (isSeamProviderPropsWithPublishableKey(options)) {
    const { publishableKey, userIdentifierKey, ...clientOptions } = options
    return {
      publishableKey,
      userIdentifierKey,
      clientOptions,
      client: null,
    }
  }

  throw new Error('Invalid SeamProvider options')
}

const defaultSeamContextValue = createDefaultSeamContextValue()

export const seamContext = createContext<SeamContext>(defaultSeamContextValue)

export function useSeamContext(): SeamContext {
  const context = useContext(seamContext)

  if (context == null) {
    throw new Error('useSeamContext must be used inside a <SeamProvider/>')
  }

  return context
}

const isSeamProviderPropsWithClient = (
  props: SeamProviderProps
): props is SeamProviderPropsWithClient => {
  if (!('client' in props)) return false

  const { client } = props
  if (client == null) return false

  if (Object.values(props).some((v) => v == null)) {
    throw new Error('Cannot provide a Seam client along with other options.')
  }

  return true
}

const isSeamProviderPropsWithPublishableKey = (
  props: SeamProviderProps
): props is SeamProviderPropsWithPublishableKey & AllowedSeamClientOptions => {
  if (!('publishableKey' in props)) return false

  const { publishableKey } = props
  if (publishableKey == null) return false

  if ('client' in props && props.client != null) {
    throw new Error('Cannot provide a Seam client along with other options.')
  }

  if ('clientSessionToken' in props && props.clientSessionToken != null) {
    throw new Error(
      'Cannot provide both a publishableKey and a clientSessionToken.'
    )
  }

  return true
}

const isSeamProviderPropsWithClientSessionToken = (
  props: SeamProviderProps
): props is SeamProviderPropsWithClientSessionToken &
  AllowedSeamClientOptions => {
  if (!('clientSessionToken' in props)) return false

  const { clientSessionToken } = props
  if (clientSessionToken == null) return false

  if ('client' in props && props.client != null) {
    throw new Error('Cannot provide a Seam client along with other options.')
  }

  if ('publishableKey' in props && props.publishableKey != null) {
    throw new Error(
      'Cannot provide both a clientSessionToken and a publishableKey .'
    )
  }

  if ('userIdentifierKey' in props && props.userIdentifierKey != null) {
    throw new Error('Cannot use a userIdentifierKey with a clientSessionToken.')
  }

  return true
}
