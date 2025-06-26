import type {
  SeamHttp,
  SeamHttpEndpoints,
  SeamHttpOptionsWithClientSessionToken,
} from '@seamapi/http/connect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import { useSeamClient } from './use-seam-client.js'

export interface SeamQueryContext {
  client: SeamHttp | null
  endpointClient: SeamHttpEndpoints | null
  clientOptions?: SeamQueryProviderClientOptions | undefined
  publishableKey?: string | undefined
  userIdentifierKey?: string | undefined
  clientSessionToken?: string | undefined
}

export type SeamQueryProviderProps =
  | SeamQueryProviderPropsWithClient
  | SeamQueryProviderPropsWithPublishableKey
  | SeamQueryProviderPropsWithClientSessionToken

export interface SeamQueryProviderPropsWithClient
  extends SeamQueryProviderBaseProps {
  client: SeamHttp
}

export interface SeamQueryProviderPropsWithPublishableKey
  extends SeamQueryProviderBaseProps,
    SeamQueryProviderClientOptions {
  publishableKey: string
  userIdentifierKey?: string
}

export interface SeamQueryProviderPropsWithClientSessionToken
  extends SeamQueryProviderBaseProps,
    SeamQueryProviderClientOptions {
  clientSessionToken: string
}

interface SeamQueryProviderBaseProps extends PropsWithChildren {
  queryClient?: QueryClient | undefined
  onSessionUpdate?: (client: SeamHttp) => void
}

type SeamClientOptions = SeamHttpOptionsWithClientSessionToken

export type SeamQueryProviderClientOptions = Pick<SeamClientOptions, 'endpoint'>

const defaultQueryClient = new QueryClient()

export function SeamQueryProvider({
  children,
  onSessionUpdate = () => {},
  queryClient,
  ...props
}: SeamQueryProviderProps): JSX.Element {
  const value = useMemo(() => {
    const context = createSeamQueryContextValue(props)
    if (
      context.client == null &&
      context.publishableKey == null &&
      context.clientSessionToken == null
    ) {
      return defaultSeamQueryContextValue
    }
    return context
  }, [props])

  if (
    value.client == null &&
    value.publishableKey == null &&
    value.clientSessionToken == null
  ) {
    throw new Error(
      `Must provide either a Seam client, clientSessionToken, or a publishableKey.`
    )
  }

  const { Provider } = seamContext

  return (
    <QueryClientProvider
      client={queryClient ?? globalThis.seamQueryClient ?? defaultQueryClient}
    >
      <Provider value={value}>
        <Session onSessionUpdate={onSessionUpdate}>{children}</Session>
      </Provider>
    </QueryClientProvider>
  )
}

function Session({
  onSessionUpdate,
  children,
}: Required<Pick<SeamQueryProviderProps, 'onSessionUpdate'>> &
  PropsWithChildren): JSX.Element | null {
  const { client } = useSeamClient()
  useEffect(() => {
    if (client != null) onSessionUpdate(client)
  }, [onSessionUpdate, client])

  return <>{children}</>
}

const createDefaultSeamQueryContextValue = (): SeamQueryContext => {
  try {
    if (globalThis.seam == null) {
      return { client: null, endpointClient: null }
    }
    return createSeamQueryContextValue(globalThis.seam)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return { client: null, endpointClient: null }
  }
}

const createSeamQueryContextValue = (
  options: SeamQueryProviderProps
): SeamQueryContext => {
  if (isSeamQueryProviderPropsWithClient(options)) {
    return {
      ...options,
      endpointClient: null,
    }
  }

  if (isSeamQueryProviderPropsWithClientSessionToken(options)) {
    const { clientSessionToken, ...clientOptions } = options
    return {
      clientSessionToken,
      clientOptions,
      client: null,
      endpointClient: null,
    }
  }

  if (isSeamQueryProviderPropsWithPublishableKey(options)) {
    const { publishableKey, userIdentifierKey, ...clientOptions } = options
    return {
      publishableKey,
      userIdentifierKey,
      clientOptions,
      client: null,
      endpointClient: null,
    }
  }

  return { client: null, endpointClient: null }
}

const defaultSeamQueryContextValue = createDefaultSeamQueryContextValue()

export const seamContext = createContext<SeamQueryContext>(
  defaultSeamQueryContextValue
)

export function useSeamQueryContext(): SeamQueryContext {
  return useContext(seamContext)
}

const isSeamQueryProviderPropsWithClient = (
  props: SeamQueryProviderProps
): props is SeamQueryProviderPropsWithClient => {
  if (!('client' in props)) return false

  const { client, ...otherProps } = props
  if (client == null) return false

  const otherNonNullProps = Object.values(otherProps).filter((v) => v != null)
  if (otherNonNullProps.length > 0) {
    throw new InvalidSeamQueryProviderProps(
      `The client prop cannot be used with ${otherNonNullProps.join(' or ')}.`
    )
  }

  return true
}

const isSeamQueryProviderPropsWithPublishableKey = (
  props: SeamQueryProviderProps
): props is SeamQueryProviderPropsWithPublishableKey &
  SeamQueryProviderClientOptions => {
  if (!('publishableKey' in props)) return false

  const { publishableKey } = props
  if (publishableKey == null) return false

  if ('client' in props && props.client != null) {
    throw new InvalidSeamQueryProviderProps(
      'The client prop cannot be used with the publishableKey prop.'
    )
  }

  if ('clientSessionToken' in props && props.clientSessionToken != null) {
    throw new InvalidSeamQueryProviderProps(
      'The clientSessionToken prop cannot be used with the publishableKey prop.'
    )
  }

  return true
}

const isSeamQueryProviderPropsWithClientSessionToken = (
  props: SeamQueryProviderProps
): props is SeamQueryProviderPropsWithClientSessionToken &
  SeamQueryProviderClientOptions => {
  if (!('clientSessionToken' in props)) return false

  const { clientSessionToken } = props
  if (clientSessionToken == null) return false

  if ('client' in props && props.client != null) {
    throw new InvalidSeamQueryProviderProps(
      'The client prop cannot be used with the clientSessionToken prop.'
    )
  }

  if ('publishableKey' in props && props.publishableKey != null) {
    throw new InvalidSeamQueryProviderProps(
      'The publishableKey prop cannot be used with the clientSessionToken prop.'
    )
  }

  if ('userIdentifierKey' in props && props.userIdentifierKey != null) {
    throw new InvalidSeamQueryProviderProps(
      'The userIdentifierKey prop cannot be used with the clientSessionToken prop.'
    )
  }

  return true
}

class InvalidSeamQueryProviderProps extends Error {
  constructor(message: string) {
    super(`SeamQueryProvider received invalid props: ${message}`)
    this.name = this.constructor.name
  }
}
