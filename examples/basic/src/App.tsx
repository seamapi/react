import { DeviceTable, SeamProvider } from '@seamapi/react'

export const App = (): JSX.Element => {
  return (
    <SeamProvider
      endpoint={import.meta.env.SEAM_ENDPOINT}
      publishableKey={import.meta.env.SEAM_PUBLISHABLE_KEY}
      userIdentifierKey={import.meta.env.SEAM_USER_IDENTIFIER_KEY}
      disableCssInjection
    >
      <main>
        <h1>Seam Components</h1>
        <DeviceTable />
      </main>
    </SeamProvider>
  )
}
