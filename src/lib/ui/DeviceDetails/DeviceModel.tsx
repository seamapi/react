import type { LockDevice } from 'seamapi'

import { getDeviceModel } from 'lib/index.js'

interface ModelStatusProps {
  device: LockDevice
}

export function DeviceModel({ device }: ModelStatusProps): JSX.Element | null {
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

const t = {
  model: 'Model',
}
