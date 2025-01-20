import type {
  DevicesGetParams,
  DevicesUpdateBody,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseSetDeviceNameParams = never

export type UseSetDeviceNameData = undefined

export type UseSetDeviceNameMutationVariables = Pick<DevicesUpdateBody, 'device_id' | 'name'>

type MutationError = SeamHttpApiError

export function useSetDeviceName(params: DevicesGetParams): UseMutationResult<
  UseSetDeviceNameData,
  MutationError,
  UseSetDeviceNameMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseSetDeviceNameData,
    MutationError,
    UseSetDeviceNameMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.devices.update(variables)
    },
    onSuccess: (_data, variables) => {

      queryClient.setQueryData<Device | null>(
        ['devices', 'get', params],
        (device) => {
          if (device == null) {
            return
          }

          return getUpdatedDevice(device, variables.name ?? device.properties.name)
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
              return getUpdatedDevice(device, variables.name ?? device.properties.name)
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