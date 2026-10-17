import { QueryClient } from '@tanstack/react-query'
import { cleanup, render } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach } from 'vitest'

import { EcosystemProvider } from 'lib/seam/ecosystem/EcosystemProvider.js'

// eslint-disable-next-line import/no-relative-parent-imports
import { handleFakeEcosystemRequest } from '../../.storybook/fake-ecosystem.js'

export {
  fakeEmbedKey,
  fakeInvalidEmbedKey,
  fakeManufacturerEmbedKey,
  fakePartnerEmbedKey,
  fakeWrongOriginEmbedKey,
  // eslint-disable-next-line import/no-relative-parent-imports
} from '../../.storybook/fake-ecosystem.js'

export interface EcosystemTestContext {
  ecosystemEndpoint: string
  /** The method and path of every request to the fake, e.g., `GET v1/compatibility`. */
  ecosystemRequests: string[]
}

const fakeEcosystemOrigin = 'http://fake-ecosystem.test'

/**
 * Serves a fake Ecosystem API at `ctx.ecosystemEndpoint` for each test in the calling file.
 * Requests are handled in-process by stubbing fetch, so no port is opened
 * (a local server could take the port the fake Devicedb server is about to bind).
 */
export const setupFakeEcosystem = (): void => {
  beforeEach<EcosystemTestContext>((ctx) => {
    const requests: string[] = []
    ctx.ecosystemEndpoint = `${fakeEcosystemOrigin}/v1/`
    ctx.ecosystemRequests = requests

    const { fetch } = globalThis
    // UPSTREAM: Under happy-dom, the global fetch is Node's,
    // which rejects the AbortSignal from happy-dom's AbortController.
    globalThis.fetch = async (input, { signal: _signal, ...init } = {}) => {
      const url = new URL(input instanceof Request ? input.url : String(input))
      if (url.origin !== fakeEcosystemOrigin) return await fetch(input, init)

      const method = init.method ?? 'GET'
      const path = url.pathname.replace(/^\/+/, '')
      requests.push(`${method} ${path}`)

      const headers: Record<string, string> = {}
      new Headers(init.headers).forEach((value, key) => {
        headers[key.toLowerCase()] = value
      })

      const {
        status,
        headers: resHeaders,
        body,
      } = handleFakeEcosystemRequest({
        method,
        path,
        searchParams: url.searchParams,
        headers,
        assetBaseUrl: fakeEcosystemOrigin,
      })
      return new Response(body, { status, headers: resHeaders })
    }

    return () => {
      globalThis.fetch = fetch
    }
  })

  afterEach(() => {
    cleanup()
  })
}

type Render = typeof render

export const renderWithEcosystem = (
  ui: Parameters<Render>[0],
  {
    ecosystemEndpoint,
    ecosystemRequests: _ecosystemRequests,
    embedKey,
    ...options
  }: Parameters<Render>[1] & EcosystemTestContext & { embedKey?: string }
): ReturnType<Render> => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function Providers({ children }: PropsWithChildren): JSX.Element {
    return (
      <EcosystemProvider
        queryClient={queryClient}
        embedKey={embedKey}
        ecosystemEndpoint={ecosystemEndpoint}
        disableCssInjection
        disableFontInjection
      >
        {children}
      </EcosystemProvider>
    )
  }
  return render(ui, { wrapper: Providers, ...options })
}
