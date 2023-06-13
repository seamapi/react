import { type CommonDevice, isLockDevice } from 'seamapi'

interface DeviceModelProps {
  device: CommonDevice
}

export function DeviceModel({ device }: DeviceModelProps): JSX.Element | null {
  const model = getDeviceModel(device)
  if (model == null) {
    return null
  }

  return (
    <>
      <span className='seam-label'>{t.model}:</span>{' '}
      <div className='seam-device-model'>{model}</div>
    </>
  )
}

export const getDeviceModel = (device: CommonDevice): string => {
  if (!isLockDevice(device)) return t.fallbackModel

  const { properties } = device

  return (
    properties?.august_metadata?.model ??
    properties?.schlage_metadata?.model ??
    t.fallbackLockModel
  )
}

const t = {
  model: 'Model',
  fallbackModel: 'Unknown Model',
  fallbackLockModel: 'Unknown Lock',
}
