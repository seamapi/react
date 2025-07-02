import type {
  SeamHttp,
  SeamHttpEndpoints,
  SeamHttpOptionsWithClientSessionToken,
} from '@seamapi/http/connect'
import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
} from '@tanstack/react-query'
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
  consoleSessionToken?: string | undefined
  workspaceId?: string | undefined
  queryKeyPrefix?: string | undefined
}

export type SeamQueryProviderProps =
  | SeamQueryProviderPropsWithClient
  | SeamQueryProviderPropsWithPublishableKey
  | SeamQueryProviderPropsWithClientSessionToken
  | SeamQueryProviderPropsWithConsoleSessionToken

export interface SeamQueryProviderPropsWithClient
  extends SeamQueryProviderBaseProps {
  client: SeamHttp
  queryKeyPrefix: string
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

export interface SeamQueryProviderPropsWithConsoleSessionToken
  extends SeamQueryProviderBaseProps,
    SeamQueryProviderClientOptions {
  consoleSessionToken: string
  workspaceId?: string | undefined
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
      context.clientSessionToken == null &&
      context.consoleSessionToken == null
    ) {
      return defaultSeamQueryContextValue
    }
    return context
  }, [props])

  if (
    value.client == null &&
    value.publishableKey == null &&
    value.clientSessionToken == null &&
    value.consoleSessionToken == null
  ) {
    throw new Error(
      `Must provide either a Seam client, clientSessionToken, publishableKey or consoleSessionToken.`
    )
  }

  const { Provider } = seamContext
  const queryClientFromContext = useContext(QueryClientContext)

  if (
    queryClientFromContext != null &&
    queryClient != null &&
    queryClientFromContext !== queryClient
  ) {
    throw new Error(
      'The QueryClient passed into SeamQueryProvider is different from the one in the existing QueryClientContext. Omit the queryClient prop from SeamProvider or SeamQueryProvider to use the existing QueryClient provided by the QueryClientProvider.'
    )
  }

  return (
    <QueryClientProvider
      client={queryClientFromContext ?? queryClient ?? defaultQueryClient}
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
    if (options.queryKeyPrefix == null) {
      throw new InvalidSeamQueryProviderProps(
        'The client prop must be used with a queryKeyPrefix prop.'
      )
    }
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

  if (isSeamQueryProviderPropsWithConsoleSessionToken(options)) {
    const { consoleSessionToken, workspaceId, ...clientOptions } = options
    return {
      consoleSessionToken,
      workspaceId,
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

  if ('consoleSessionToken' in props && props.consoleSessionToken != null) {
    throw new InvalidSeamQueryProviderProps(
      'The consoleSessionToken prop cannot be used with the publishableKey prop.'
    )
  }

  if ('workspaceId' in props && props.workspaceId != null) {
    throw new InvalidSeamQueryProviderProps(
      'The workspaceId prop cannot be used with the publishableKey prop.'
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

  if ('consoleSessionToken' in props && props.consoleSessionToken != null) {
    throw new InvalidSeamQueryProviderProps(
      'The consoleSessionToken prop cannot be used with the clientSessionToken prop.'
    )
  }

  if ('workspaceId' in props && props.workspaceId != null) {
    throw new InvalidSeamQueryProviderProps(
      'The workspaceId prop cannot be used with the clientSessionToken prop.'
    )
  }

  return true
}

const isSeamQueryProviderPropsWithConsoleSessionToken = (
  props: SeamQueryProviderProps
): props is SeamQueryProviderPropsWithConsoleSessionToken &
  SeamQueryProviderClientOptions => {
  if (!('consoleSessionToken' in props)) return false

  const { consoleSessionToken } = props
  if (consoleSessionToken == null) return false

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

  if ('publishableKey' in props && props.publishableKey != null) {
    throw new InvalidSeamQueryProviderProps(
      'The publishableKey prop cannot be used with the consoleSessionToken prop.'
    )
  }

  if ('userIdentifierKey' in props && props.userIdentifierKey != null) {
    throw new InvalidSeamQueryProviderProps(
      'The userIdentifierKey prop cannot be used with the consoleSessionToken prop.'
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
