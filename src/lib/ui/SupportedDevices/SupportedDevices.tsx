import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SupportedDevicesTable } from 'lib/ui/SupportedDevices/SupportedDevicesTable.js'

import type { SupportedDevicesTableProps } from 'lib/ui/SupportedDevices/SupportedDevicesTable.js'

const client = new QueryClient()

export function SupportedDevices(props: SupportedDevicesTableProps) {
  return (
    <QueryClientProvider client={client}>
      <SupportedDevicesTable {...props} />
    </QueryClientProvider>
  )
}
