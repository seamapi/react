import { QueryClient } from '@tanstack/react-query'
import { cleanup, render } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach } from 'vitest'

import { EcosystemProvider } from 'lib/seam/ecosystem/EcosystemProvider.js'

// eslint-disable-next-line import/no-relative-parent-imports
import { startFakeEcosystemServer } from '../../.storybook/fake-ecosystem.js'

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
}

/** Starts a fake Ecosystem API for each test in the calling file. */
export const setupFakeEcosystem = (): void => {
  beforeEach<EcosystemTestContext>(async (ctx) => {
    const fake = await startFakeEcosystemServer()
    ctx.ecosystemEndpoint = fake.endpoint

    // UPSTREAM: Under happy-dom, the global fetch is Node's,
    // which rejects the AbortSignal from happy-dom's AbortController.
    const { fetch } = globalThis
    globalThis.fetch = async (input, { signal: _signal, ...init } = {}) =>
      await fetch(input, init)

    return async () => {
      globalThis.fetch = fetch
      await fake.close()
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
