import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SupportedDevicesTable } from 'lib/ui/SupportedDevices/SupportedDevicesTable.js'
export interface SupportedDevicesProps {
  cannotFilter?: boolean
}

const client = new QueryClient()

export function SupportedDevices(props: SupportedDevicesProps) {
  return (
    <QueryClientProvider client={client}>
      <SupportedDevicesTable {...props} />
    </QueryClientProvider>
  )
}
