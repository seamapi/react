import { type ReactElement } from 'react'

import { DeviceManager, SeamProvider } from 'index.js'

export const App = (): ReactElement => {
  return (
    <main>
      <h1>Seam Components</h1>
      <SeamProvider>
        <DeviceManager />
      </SeamProvider>
    </main>
  )
}
