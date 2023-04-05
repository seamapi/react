import { type ReactElement } from 'react'

import { DeviceList, SeamProvider } from 'index.js'

export const App = (): ReactElement => {
  return (
    <main>
      <h1>Seam Components</h1>
      <SeamProvider>
        <DeviceList />
      </SeamProvider>
    </main>
  )
}
