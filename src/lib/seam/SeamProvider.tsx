import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import type { Seam, SeamClientOptions } from 'seamapi'

import {
  type TelemetryClient,
  TelemetryProvider,
  useUserTelemetry,
} from 'lib/telemetry/index.js'

import { useSeamFont } from 'lib/seam/use-seam-font.js'
import { useSeamStyles } from 'lib/seam/use-seam-styles.js'

import { useSeamClient } from './use-seam-client.js'

declare global {
  // eslint-disable-next-line no-var
  var seam: SeamProviderProps | undefined
  // eslint-disable-next-line no-var
  var seamQueryClient: QueryClient | undefined
  // eslint-disable-next-line no-var
  var seamTelemetryClient: TelemetryClient | undefined
}

export interface SeamContext {
  client: Seam | null
  clientOptions?: SeamProviderClientOptions | undefined
  publishableKey?: string | undefined
  userIdentifierKey?: string | undefined
  clientSessionToken?: string | undefined
}

export type SeamProviderProps =
  | SeamProviderPropsWithClient
  | SeamProviderPropsWithPublishableKey
  | SeamProviderPropsWithClientSessionToken

export interface SeamProviderPropsWithClient extends SeamProviderBaseProps {
  client: Seam
}

export interface SeamProviderPropsWithPublishableKey
  extends SeamProviderBaseProps,
    SeamProviderClientOptions {
  publishableKey: string
  userIdentifierKey?: string
}

export interface SeamProviderPropsWithClientSessionToken
  extends SeamProviderBaseProps,
    SeamProviderClientOptions {
  clientSessionToken: string
}

interface SeamProviderBaseProps extends PropsWithChildren {
  disableTelemetry?: boolean | undefined
  disableCssInjection?: boolean | undefined
  disableFontInjection?: boolean | undefined
  unminifiyCss?: boolean | undefined
  queryClient?: QueryClient | undefined
  telemetryClient?: TelemetryClient | undefined
  onSessionUpdate?: (client: Seam) => void
}

export type SeamProviderClientOptions = Pick<SeamClientOptions, 'endpoint'>

const defaultQueryClient = new QueryClient()

export const seamComponentsClassName = 'seam-components'

export function SeamProvider({
  children,
  disableTelemetry = false,
  disableCssInjection = false,
  disableFontInjection = false,
  unminifiyCss = false,
  onSessionUpdate = () => {},
  queryClient,
  telemetryClient,
  ...props
}: SeamProviderProps): JSX.Element {
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
      `Must provide either a Seam client, clientSessionToken, or a publishableKey.`
    )
  }

  const { Provider } = seamContext

  const endpoint = 'endpoint' in props ? props.endpoint : undefined

  return (
    <div className={seamComponentsClassName}>
      <TelemetryProvider
        client={telemetryClient ?? globalThis.seamTelemetryClient}
        disabled={disableTelemetry}
        endpoint={endpoint}
      >
        <QueryClientProvider
          client={
            queryClient ?? globalThis.seamQueryClient ?? defaultQueryClient
          }
        >
          <Provider value={value}>
            <Wrapper onSessionUpdate={onSessionUpdate}>{children}</Wrapper>
          </Provider>
        </QueryClientProvider>
      </TelemetryProvider>
    </div>
  )
}

function Wrapper({
  onSessionUpdate,
  children,
}: Required<Pick<SeamProviderProps, 'onSessionUpdate'>> &
  PropsWithChildren): JSX.Element | null {
  useUserTelemetry()

  const { client } = useSeamClient()
  useEffect(() => {
    if (client != null) onSessionUpdate(client)
  }, [onSessionUpdate, client])

  return <>{children}</>
}

const createDefaultSeamContextValue = (): SeamContext => {
  try {
    if (globalThis.seam == null) {
      return { client: null }
    }
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

  return { client: null }
}

const defaultSeamContextValue = createDefaultSeamContextValue()

export const seamContext = createContext<SeamContext>(defaultSeamContextValue)

export function useSeamContext(): SeamContext {
  return useContext(seamContext)
}

const isSeamProviderPropsWithClient = (
  props: SeamProviderProps
): props is SeamProviderPropsWithClient => {
  if (!('client' in props)) return false

  const { client } = props
  if (client == null) return false

  const otherNonNullProps = Object.values(props).filter((v) => v != null)
  if (otherNonNullProps.length > 0) {
    throw new InvalidSeamProviderProps(
      `The client prop cannot be used with ${otherNonNullProps.join(' or ')}.`
    )
  }

  return true
}

const isSeamProviderPropsWithPublishableKey = (
  props: SeamProviderProps
): props is SeamProviderPropsWithPublishableKey & SeamProviderClientOptions => {
  if (!('publishableKey' in props)) return false

  const { publishableKey } = props
  if (publishableKey == null) return false

  if ('client' in props && props.client != null) {
    throw new InvalidSeamProviderProps(
      'The client prop cannot be used with the publishableKey prop.'
    )
  }

  if ('clientSessionToken' in props && props.clientSessionToken != null) {
    throw new InvalidSeamProviderProps(
      'The clientSessionToken prop cannot be used with the publishableKey prop.'
    )
  }

  return true
}

const isSeamProviderPropsWithClientSessionToken = (
  props: SeamProviderProps
): props is SeamProviderPropsWithClientSessionToken &
  SeamProviderClientOptions => {
  if (!('clientSessionToken' in props)) return false

  const { clientSessionToken } = props
  if (clientSessionToken == null) return false

  if ('client' in props && props.client != null) {
    throw new InvalidSeamProviderProps(
      'The client prop cannot be used with the clientSessionToken prop.'
    )
  }

  if ('publishableKey' in props && props.publishableKey != null) {
    throw new InvalidSeamProviderProps(
      'The publishableKey prop cannot be used with the clientSessionToken prop.'
    )
  }

  if ('userIdentifierKey' in props && props.userIdentifierKey != null) {
    throw new InvalidSeamProviderProps(
      'The userIdentifierKey prop cannot be used with the clientSessionToken prop.'
    )
  }

  return true
}

class InvalidSeamProviderProps extends Error {
  constructor(message: string) {
    super(`SeamProvider received invalid props: ${message}`)
    this.name = this.constructor.name
  }
}
