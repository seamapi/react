import type { Device } from '@seamapi/types/connect'

interface DeviceModelProps {
  device: Device
}

export function DeviceModel({ device }: DeviceModelProps): JSX.Element | null {
  return (
    <>
      <span className='seam-label'>{t.model}:</span>{' '}
      <div className='seam-device-model'>
        {device.properties.model.manufacturer_display_name}{' '}
        {device.properties.model.display_name}
      </div>
    </>
  )
}

const t = {
  model: 'Model',
}
