import { SeamProvider } from '@seamapi/react'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

const publishableKey = 'seam_pk1fGd41X_zKs0ZELRWEc8nWxiBsrTFC98'

const Providers = ({ children }: { children: ReactNode }): ReactElement => {
  return <SeamProvider publishableKey={publishableKey}>{children}</SeamProvider>
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
