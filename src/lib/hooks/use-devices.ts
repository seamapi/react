import { useQuery, type UseQueryResult } from '@tanstack/react-query'

// import { type Device } from 'seamapi'
import { type Device, type SeamError } from 'lib/seam-client-stub.js'

import { useSeam } from './use-seam.js'

type Result = UseQueryResult<Device[], SeamError>

interface UseDevicesOptions {
  manufacturer?: string | undefined
}

type UseDevicesResult = Omit<Result, 'data'> & { devices: Result['data'] }

export function useDevices({
  manufacturer
}: UseDevicesOptions = {}): UseDevicesResult {
  const { client } = useSeam()
  const { data: devices, ...rest } = useQuery<Device[], SeamError>({
    queryKey: ['list', 'devices', { manufacturer }],
    queryFn: async () => await client.devices.list({ manufacturer })
  })

  return { ...rest, devices }
}
