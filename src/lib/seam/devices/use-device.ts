import { useQuery } from '@tanstack/react-query'
import type {
  CommonDeviceProperties,
  Device,
  DeviceGetRequest,
  DeviceGetResponse,
  LockDevice,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceParams = DeviceGetRequest | string
export type UseDeviceData = Device<CommonDeviceProperties> | null

export function useDevice(
  params: DeviceGetRequest
): UseSeamQueryResult<'device', UseDeviceData> {
  const normalizedParams =
    typeof params === 'string' ? { device_id: params } : params

  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<
    DeviceGetResponse['device'] | null,
    SeamError
  >({
    enabled: client != null,
    queryKey: ['devices', 'get', normalizedParams],
    queryFn: async () => {
      if (client == null) return null
      return await client?.devices.get(normalizedParams)
    },
  })

  return { ...rest, device: data }
}

export function useFakeDevice(_params: DeviceGetRequest): {
  isLoading: boolean
  device: UseDeviceData
} {
  const device: LockDevice = {
    device_id: 'f9a9ab36-9e14-4390-a88c-b4c78304c6aa',
    device_type: 'august_lock',
    capabilities_supported: ['access_code', 'lock'],
    properties: {
      locked: true,
      online: true,
      door_open: false,
      manufacturer: 'august',
      battery_level: 0.9999532347993827,
      serial_number: '00000004-992d-45a0-bea1-9128fdcd8d12',
      august_metadata: {
        lock_id: 'lock-1',
        house_id: 'house-1',
        lock_name: 'FRONT DOOR',
        has_keypad: true,
        house_name: 'My House',
      },
      supported_code_lengths: [6],
      name: 'FRONT DOOR',
      battery: {
        level: 0.9999532347993827,
        status: 'full',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/august_wifi-smart-lock-3rd-gen_silver_front.png',
    },
    location: {
      timezone: 'America/Los_Angeles',
      location_name: 'My House',
    },
    connected_account_id: '6fc0f854-cb5a-461a-af93-e543ce1f730f',
    workspace_id: 'a9598de8-e627-4d01-b119-61ab7b9e07bd',
    created_at: '2023-05-08T22:37:24.206Z',
    errors: [],
    warnings: [],
  }

  return { isLoading: false, device }
}
