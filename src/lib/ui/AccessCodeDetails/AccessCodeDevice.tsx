import { useDevice } from 'lib/hooks/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { getDeviceModel } from 'lib/ui/DeviceDetails/DeviceModel.js'
import { TextButton } from 'lib/ui/TextButton.js'

export default function AccessCodeDevice({ deviceId }: { deviceId: string }) {
  const { device, isLoading } = useDevice(deviceId)

  // TODO: Do we want to return a skeleton loader here instead?
  if (isLoading || !device) {
    return null
  }

  const model = getDeviceModel(device)

  return (
    <div className='seam-access-code-device'>
      <DeviceImage device={device} />
      <div className='seam-body'>
        <span className='seam-model'>{model}</span>
        <TextButton>{t.deviceDetails}</TextButton>
      </div>
      <Button>Unlock</Button>
    </div>
  )
}

const t = {
  deviceDetails: 'Device details',
}
