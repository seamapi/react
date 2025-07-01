import type { SeamHttp } from '@seamapi/http/connect'
import type { QueryClient } from '@tanstack/react-query'
import { createContext, type PropsWithChildren, useMemo } from 'react'

import {
  SeamQueryProvider,
  type SeamQueryProviderPropsWithClient,
  type SeamQueryProviderPropsWithClientSessionToken,
  type SeamQueryProviderPropsWithPublishableKey,
} from 'lib/seam/SeamQueryProvider.js'
import { useSeamFont } from 'lib/seam/use-seam-font.js'
import { useSeamStyles } from 'lib/seam/use-seam-styles.js'
import {
  type TelemetryClient,
  TelemetryProvider,
  useUserTelemetry,
} from 'lib/telemetry/index.js'

declare global {
  // eslint-disable-next-line no-var
  var seam: SeamProviderProps | undefined
  // eslint-disable-next-line no-var
  var seamQueryClient: QueryClient | undefined
  // eslint-disable-next-line no-var
  var seamTelemetryClient: TelemetryClient | undefined
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SeamContext {}

export type SeamProviderProps =
  | SeamProviderPropsWithClient
  | SeamProviderPropsWithPublishableKey
  | SeamProviderPropsWithClientSessionToken

export interface SeamProviderPropsWithClient
  extends SeamQueryProviderPropsWithClient,
    SeamProviderBaseProps {}

export interface SeamProviderPropsWithPublishableKey
  extends SeamProviderBaseProps,
    SeamQueryProviderPropsWithPublishableKey {
  publishableKey: string
  userIdentifierKey?: string
}

export interface SeamProviderPropsWithClientSessionToken
  extends SeamProviderBaseProps,
    SeamQueryProviderPropsWithClientSessionToken {
  clientSessionToken: string
}

interface SeamProviderBaseProps extends PropsWithChildren {
  disableTelemetry?: boolean | undefined
  disableCssInjection?: boolean | undefined
  disableFontInjection?: boolean | undefined
  unminifiyCss?: boolean | undefined
  queryClient?: QueryClient | undefined
  telemetryClient?: TelemetryClient | undefined
  onSessionUpdate?: (client: SeamHttp) => void
}

export const seamComponentsClassName = 'seam-components'

export function SeamProvider({
  children,
  disableTelemetry = false,
  disableCssInjection = false,
  disableFontInjection = false,
  unminifiyCss = false,
  telemetryClient,
  queryClient,
  ...props
}: SeamProviderProps): JSX.Element {
  useSeamStyles({ disabled: disableCssInjection, unminified: unminifiyCss })
  useSeamFont({ disabled: disableFontInjection })

  const { Provider } = seamContext

  const endpoint = 'endpoint' in props ? props.endpoint : undefined
  const value = useMemo(() => {
    const context = createSeamContextValue(props)
    return context
  }, [props])

  return (
    <div className={seamComponentsClassName}>
      <TelemetryProvider
        client={telemetryClient ?? globalThis.seamTelemetryClient}
        disabled={disableTelemetry}
        endpoint={endpoint}
      >
        <SeamQueryProvider
          queryClient={queryClient ?? globalThis.seamQueryClient}
          {...props}
        >
          <Provider value={value}>
            <Telemetry>{children}</Telemetry>
          </Provider>
        </SeamQueryProvider>
      </TelemetryProvider>
    </div>
  )
}

function Telemetry({ children }: PropsWithChildren): JSX.Element | null {
  useUserTelemetry()
  return <>{children}</>
}

const createDefaultSeamContextValue = (): SeamContext => {
  try {
    if (globalThis.seam == null) {
      return {}
    }
    return createSeamContextValue(globalThis.seam)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return {}
  }
}

const createSeamContextValue = (_options: SeamProviderProps): SeamContext => {
  return {}
}

const defaultSeamContextValue = createDefaultSeamContextValue()

const seamContext = createContext<SeamContext>(defaultSeamContextValue)
