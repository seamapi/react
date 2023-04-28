import type { ReactElement } from 'react'

import { DeviceManager, SeamProvider } from 'index.js'

export const App = (): ReactElement => {
  return (
    <SeamProvider
      endpoint={import.meta.env.SEAM_ENDPOINT}
      publishableKey={import.meta.env.SEAM_PUBLISHABLE_KEY}
    >
      <main>
        <h1>Seam Components</h1>
        <DeviceManager />
      </main>
    </SeamProvider>
  )
}
