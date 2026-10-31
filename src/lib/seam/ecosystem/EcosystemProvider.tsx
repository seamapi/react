import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'

import { defaultEcosystemEndpoint } from 'lib/seam/ecosystem/client.js'
import { seamComponentsClassName } from 'lib/seam/seam-components-class-name.js'
import { useSeamFont } from 'lib/seam/use-seam-font.js'
import { useSeamStyles } from 'lib/seam/use-seam-styles.js'

export interface EcosystemContext {
  /** The embed key sent as `X-Embed-Key`, if any. */
  embedKey: string | undefined
  /** The Ecosystem API endpoint, ending in `/`. */
  endpoint: string
}

export interface EcosystemOptions {
  /**
   * Seam Ecosystem embed key (`eco_live_…`).
   * Required outside seam.co: the key's allowed origins must include the page origin.
   */
  embedKey?: string | undefined
  /** Seam Ecosystem API endpoint. Defaults to `https://ecosystem.seam.co/v1/`. */
  ecosystemEndpoint?: string | undefined
}

export interface EcosystemProviderProps
  extends EcosystemOptions,
    PropsWithChildren {
  queryClient?: QueryClient | undefined
  /** Server data returned by `prefetchSupportedDevices` from `@seamapi/react/server.js`. */
  dehydratedState?: DehydratedState | undefined
  disableCssInjection?: boolean | undefined
  disableFontInjection?: boolean | undefined
  unminifiyCss?: boolean | undefined
}

/**
 * Provides the Seam Ecosystem context for `CompatibleApps` and `SupportedDevices`.
 *
 * Unlike `SeamProvider`, this does not need a Seam publishable key
 * and does not load the Seam API client, so it stays lightweight.
 * Inside a `SeamProvider`, pass `embedKey` to the `SeamProvider` instead.
 */
export function EcosystemProvider({
  children,
  queryClient,
  dehydratedState,
  disableCssInjection = false,
  disableFontInjection = false,
  unminifiyCss = false,
  ...options
}: EcosystemProviderProps): JSX.Element {
  useSeamStyles({ disabled: disableCssInjection, unminified: unminifiyCss })
  useSeamFont({ disabled: disableFontInjection })

  const queryClientFromContext = useContext(QueryClientContext)
  // Each server render gets its own fallback cache; never share request data.
  const [fallbackQueryClient] = useState(() => new QueryClient())

  return (
    <div className={seamComponentsClassName}>
      <QueryClientProvider
        client={
          queryClient ??
          queryClientFromContext ??
          (typeof window === 'undefined'
            ? undefined
            : globalThis.seamQueryClient) ??
          fallbackQueryClient
        }
      >
        <HydrationBoundary state={dehydratedState}>
          <EcosystemContextProvider {...options}>
            {children}
          </EcosystemContextProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </div>
  )
}

/**
 * Provides only the Ecosystem context; used by `SeamProvider`.
 * Unset options inherit from an enclosing provider.
 */
export function EcosystemContextProvider({
  children,
  embedKey,
  ecosystemEndpoint,
}: EcosystemOptions & PropsWithChildren): JSX.Element {
  const parent = useContext(ecosystemContext)

  const value = useMemo(
    () => ({
      embedKey: normalizeEmbedKey(embedKey) ?? parent.embedKey,
      endpoint: normalizeEndpoint(ecosystemEndpoint) ?? parent.endpoint,
    }),
    [embedKey, ecosystemEndpoint, parent]
  )

  return (
    <ecosystemContext.Provider value={value}>
      {children}
    </ecosystemContext.Provider>
  )
}

export function useEcosystemContext(): EcosystemContext {
  return useContext(ecosystemContext)
}

const normalizeEmbedKey = (
  embedKey: string | undefined
): string | undefined => {
  const key = embedKey?.trim()
  if (key == null || key.length === 0) return undefined
  return key
}

const normalizeEndpoint = (
  endpoint: string | undefined
): string | undefined => {
  const value = endpoint?.trim()
  if (value == null || value.length === 0) return undefined
  return value.endsWith('/') ? value : `${value}/`
}

const ecosystemContext = createContext<EcosystemContext>({
  embedKey: undefined,
  endpoint: defaultEcosystemEndpoint,
})
