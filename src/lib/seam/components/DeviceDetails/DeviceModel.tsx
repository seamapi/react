import type { CommonDevice } from 'seamapi'

interface DeviceModelProps {
  device: CommonDevice
}

export function DeviceModel({ device }: DeviceModelProps): JSX.Element | null {
  return (
    <>
      <span className='seam-label'>{t.model}:</span>{' '}
      <div className='seam-device-model'>
        {device.properties.model.display_name}
      </div>
    </>
  )
}

const t = {
  model: 'Model',
}
