import type { ReactElement } from 'react'

import { DeviceManager, SeamProvider } from 'index.js'

export const App = (): ReactElement => {
  return (
    <SeamProvider>
      <main>
        <h1>Seam Components</h1>
        <DeviceManager />
      </main>
    </SeamProvider>
  )
}
