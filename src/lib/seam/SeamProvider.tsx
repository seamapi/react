import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react'
import type { Seam, SeamClientOptions } from 'seamapi'

import { useSeamFont } from 'lib/seam/use-seam-font.js'
import { useSeamStyles } from 'lib/seam/use-seam-styles.js'

declare global {
  // eslint-disable-next-line no-var
  var seam: SeamProviderProps | undefined
  // eslint-disable-next-line no-var
  var seamQueryClient: QueryClient | undefined
}

export interface SeamContext {
  client: Seam | null
  clientOptions?: AllowedSeamClientOptions | undefined
  publishableKey?: string | undefined
  userIdentifierKey?: string | undefined
  clientSessionToken?: string | undefined
}

type SeamProviderProps = SeamProviderBaseProps &
  (
    | SeamProviderPropsWithClient
    | (SeamProviderPropsWithPublishableKey & AllowedSeamClientOptions)
    | (SeamProviderPropsWithClientSessionToken & AllowedSeamClientOptions)
  )

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

interface SeamProviderBaseProps {
  disableCssInjection?: boolean | undefined
  disableFontInjection?: boolean | undefined
  unminifiyCss?: boolean | undefined
  queryClient?: QueryClient | undefined
}

type AllowedSeamClientOptions = Pick<SeamClientOptions, 'endpoint'>

const defaultQueryClient = new QueryClient()

export function SeamProvider({
  children,
  disableCssInjection = false,
  disableFontInjection = false,
  unminifiyCss = false,
  queryClient,
  ...props
}: PropsWithChildren<SeamProviderProps>): JSX.Element {
  useSeamStyles({ disabled: disableCssInjection, unminified: unminifiyCss })
  useSeamFont({ disabled: disableFontInjection })

  const value = useMemo(() => {
    const context = createSeamContextValue(props)
    if (
      context.client == null &&
      context.publishableKey == null &&
      context.clientSessionToken == null
    ) {
      return defaultSeamContextValue
    }
    return context
  }, [props])

  if (
    value.client == null &&
    value.publishableKey == null &&
    value.clientSessionToken == null
  ) {
    throw new Error(
      `Must provide either a Seam client, clientSessionToken or a publishableKey.`
    )
  }

  const { Provider } = seamContext

  return (
    <div className='seam-components'>
      <QueryClientProvider
        client={queryClient ?? globalThis.seamQueryClient ?? defaultQueryClient}
      >
        <Provider value={value}>{children}</Provider>
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
      'Cannot provide both a clientSessionToken and a publishableKey.'
    )
  }

  if ('userIdentifierKey' in props && props.userIdentifierKey != null) {
    throw new Error('Cannot use a userIdentifierKey with a clientSessionToken.')
  }

  return true
}
