import type { LockDevice } from 'seamapi'

interface DeviceModelProps {
  device: LockDevice
}

export function DeviceModel({ device }: DeviceModelProps): JSX.Element | null {
  const model = getDeviceModel(device)
  if (!model) {
    return null
  }

  return (
    <>
      <span className='seam-label'>{t.model}:</span>{' '}
      <div className='seam-device-model'>{model}</div>
    </>
  )
}

export const getDeviceModel = ({
  properties,
}: LockDevice): string | undefined => {
  return (
    properties?.august_metadata?.model ??
    properties?.schlage_metadata?.model ??
    t.fallbackModel
  )
}

const t = {
  model: 'Model',
  fallbackModel: 'Unknown Lock',
}
