import { SeamProvider } from '@seamapi/react'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

declare global {
  // eslint-disable-next-line no-var
  var JEST_SEAM_ENDPOINT: string
  // eslint-disable-next-line no-var
  var JEST_SEAM_PUBLISHABLE_KEY: string
}

const Providers = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <SeamProvider
      endpoint={globalThis.JEST_SEAM_ENDPOINT}
      publishableKey={globalThis.JEST_SEAM_PUBLISHABLE_KEY}
    >
      {children}
    </SeamProvider>
  )
}

type Render = typeof render

const customRender = (
  ui: Parameters<Render>[0],
  options?: Parameters<Render>[1]
): ReturnType<Render> => render(ui, { wrapper: Providers, ...options })

// eslint-disable-next-line import/export
export * from '@testing-library/react'
// eslint-disable-next-line import/export
export { customRender as render }
