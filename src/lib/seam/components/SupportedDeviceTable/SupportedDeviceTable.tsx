import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { SupportedDeviceContentProps } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'
import { SupportedDeviceContent } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'

const client = new QueryClient()

export type SupportedDeviceTableProps = SupportedDeviceContentProps

export function SupportedDeviceTable(props: SupportedDeviceContentProps) {
  return (
    <QueryClientProvider client={client}>
      <SupportedDeviceContent {...props} />
    </QueryClientProvider>
  )
}
