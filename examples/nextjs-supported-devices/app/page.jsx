import {
  EcosystemProvider,
  SupportedDevices,
} from '@seamapi/react/ecosystem-react.js'
import { prefetchSupportedDevices } from '@seamapi/react/server.js'

export const revalidate = 3600

export default async function Page() {
  const embedKey = process.env.NEXT_PUBLIC_ECOSYSTEM_EMBED_KEY
  const ecosystemEndpoint = process.env.NEXT_PUBLIC_ECOSYSTEM_ENDPOINT
  const origin = process.env.ECOSYSTEM_PAGE_ORIGIN
  if (!embedKey || !origin) {
    throw new Error(
      'Set NEXT_PUBLIC_ECOSYSTEM_EMBED_KEY and ECOSYSTEM_PAGE_ORIGIN. See the example README.'
    )
  }
  const filters = {
    manufacturer: 'august',
    provider: 'august-access',
    deviceType: 'smartlock',
  }
  const dehydratedState = await prefetchSupportedDevices({
    ...filters,
    embedKey,
    ecosystemEndpoint,
    origin,
    fetch: async (input, init) =>
      await fetch(input, {
        ...init,
        next: { revalidate: 3600 },
      }),
  })

  return (
    <main style={{ maxWidth: 1000, margin: '40px auto', padding: '0 16px' }}>
      <h1>August supported devices</h1>
      <p>
        Expand a device to review model information, providers, and capability
        requirements.
      </p>
      <EcosystemProvider
        embedKey={embedKey}
        ecosystemEndpoint={ecosystemEndpoint}
        dehydratedState={dehydratedState}
        disableCssInjection
        disableFontInjection
      >
        <SupportedDevices {...filters} hideTitle />
      </EcosystemProvider>
    </main>
  )
}
