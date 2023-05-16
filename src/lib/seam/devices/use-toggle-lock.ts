import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ActionAttempt,
  CommonDeviceProperties,
  Device,
  LockDevice,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/index.js'

import { isLockDevice } from 'lib/seam/devices/types.js'

export function useToggleLock({
  device_id: deviceId,
  properties: { locked },
}: LockDevice): UseMutationResult<
  { actionAttempt: ActionAttempt },
  SeamError,
  void
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (client == null) {
        throw new Error('Missing seam client')
      }

      const toggle = locked ? client.locks.unlockDoor : client.locks.lockDoor
      return await toggle(deviceId)
    },
    onMutate: () => {
      qc.setQueryData<Array<Device<CommonDeviceProperties>>>(
        ['devices', 'list', {}],
        (devices) => {
          if (devices == null) {
            return
          }

          return devices.map((d) => {
            const isTarget = d.device_id === deviceId

            if (isTarget && isLockDevice(d)) {
              return {
                ...d,
                properties: {
                  ...d.properties,
                  locked: !d.properties.locked,
                },
              }
            }

            return d
          })
        }
      )

      qc.setQueryData<LockDevice>(
        ['devices', 'get', { device_id: deviceId }],
        (device) => {
          if (device == null) {
            return
          }

          return {
            ...device,
            properties: {
              ...device.properties,
              locked: !device.properties.locked,
            },
          }
        }
      )
    },
    onSettled: async () => {
      await qc.invalidateQueries({
        queryKey: ['devices', 'list'],
      })
      await qc.invalidateQueries({
        queryKey: ['devices', 'get', { device_id: deviceId }],
      })
    },
  })
}
