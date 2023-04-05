import { render } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'

import { SeamProvider } from 'index.js'

const Providers = ({ children }: { children: ReactNode }): ReactElement => {
  return <SeamProvider publishableKey='test-key'>{children}</SeamProvider>
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
