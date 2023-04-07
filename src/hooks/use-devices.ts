import { useQuery } from '@tanstack/react-query'
import Seam from 'seamapi'
import { useSeamClient } from './use-seam-client'

export const useDevices = (seam: Seam) => {
  return useQuery([`devices`], () => seam.devices.list(), {
    enabled: Boolean(seam),
  })
}

export default useDevices
