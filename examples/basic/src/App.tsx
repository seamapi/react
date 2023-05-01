import { DeviceManager, SeamProvider } from '@seamapi/react'
import type { ReactElement } from 'react'

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
