import { type ReactElement } from 'react'

import { DeviceList, SeamProvider } from 'index.js'

export const App = (): ReactElement => {
  return (
    <main>
      <h1>Seam Components</h1>
      <SeamProvider
        publishableKey='my-seam-publishable-key'
        sessionKey='my-user-id'
      >
        <DeviceList />
      </SeamProvider>
    </main>
  )
}
