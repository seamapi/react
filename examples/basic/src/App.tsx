import type { ReactElement } from 'react'

import { DeviceManager, SeamComponents } from 'index.js'

export const App = (): ReactElement => {
  return (
    <SeamComponents>
      <main>
        <h1>Seam Components</h1>
        <DeviceManager />
      </main>
    </SeamComponents>
  )
}
