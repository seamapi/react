import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { SupportedDevicesContentProps } from 'lib/ui/SupportedDevicesTable/SupportedDevicesContent.js'
import { SupportedDevicesContent } from 'lib/ui/SupportedDevicesTable/SupportedDevicesContent.js'

const client = new QueryClient()

export function SupportedDevicesTable(props: SupportedDevicesContentProps) {
  return (
    <QueryClientProvider client={client}>
      <SupportedDevicesContent {...props} />
    </QueryClientProvider>
  )
}
