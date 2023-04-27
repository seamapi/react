import type { ReactElement } from 'react'

import { DeviceManager, SeamProvider } from 'index.js'

export const App = (): ReactElement => {
  return (
    <SeamProvider
      // @ts-expect-error https://vitejs.dev/guide/env-and-mode.html#production-replacement
      endpoint={import.meta.env.SEAM_ENDPOINT}
      // @ts-expect-error https://vitejs.dev/guide/env-and-mode.html#production-replacement
      publishableKey={import.meta.env.SEAM_PUBLISHABLE_KEY}
    >
      <main>
        <h1>Seam Components</h1>
        <DeviceManager />
      </main>
    </SeamProvider>
  )
}
