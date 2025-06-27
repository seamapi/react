import type { DevicesUpdateParameters } from '@seamapi/http/connect'
import type { Device } from '@seamapi/types/connect'
import { useQueryClient } from '@tanstack/react-query'

import {
  useSeamMutation,
  type UseSeamMutationResult,
} from '../use-seam-mutation.js'

export type UseUpdateDeviceNameParams = never

export type UseUpdateDeviceNameData = undefined

export type UseUpdateDeviceNameMutationVariables = Pick<
  DevicesUpdateParameters,
  'device_id' | 'name'
>

export function useUpdateDeviceName(
  params: DevicesUpdateParameters
): UseSeamMutationResult<'/devices/update'> {
  const queryClient = useQueryClient()

  return useSeamMutation('/devices/update', {
    onSuccess: (_data, variables) => {
      if (variables == null) return

      queryClient.setQueryData<Device | null>(
        ['devices', 'get', params],
        (device) => {
          if (device == null) {
            return
          }

          return getUpdatedDevice(
            device,
            variables.name ?? device.properties.name
          )
        }
      )

      queryClient.setQueryData<Device[]>(
        ['devices', 'list', { device_id: variables.device_id }],
        (devices): Device[] => {
          if (devices == null) {
            return []
          }

          return devices.map((device) => {
            if (device.device_id === variables.device_id) {
              return getUpdatedDevice(
                device,
                variables.name ?? device.properties.name
              )
            }

            return device
          })
        }
      )
    },
  })
}

const getUpdatedDevice = (device: Device, name: string): Device => {
  const { properties } = device

  return {
    ...device,
    properties: {
      ...properties,
      name,
    },
  }
}
