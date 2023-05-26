import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { SupportedDevicesContentProps } from 'lib/ui/SupportedDevices/SupportedDevicesContent.js'
import { SupportedDevicesContent } from 'lib/ui/SupportedDevices/SupportedDevicesContent.js'

const client = new QueryClient()

export function SupportedDevices(props: SupportedDevicesContentProps) {
  return (
    <QueryClientProvider client={client}>
      <SupportedDevicesContent {...props} />
    </QueryClientProvider>
  )
}
