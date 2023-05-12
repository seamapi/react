import { isLockDevice } from 'lib/seam/devices/types.js'
import { useFakeDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { getDeviceModel } from 'lib/ui/DeviceDetails/DeviceModel.js'
import { TextButton } from 'lib/ui/TextButton.js'

export default function AccessCodeDevice({ deviceId }: { deviceId: string }) {
  //  TODO: Replace with `useDevice()` once ready
  const { isLoading, device } = useFakeDevice({ device_id: deviceId })

  // TODO: Do we want to return a skeleton loader here instead?
  if (isLoading || !device || !isLockDevice(device)) {
    return null
  }

  const model = getDeviceModel(device)

  return (
    <div className='seam-access-code-device'>
      <div className='seam-device-image'>
        <DeviceImage device={device} />
      </div>
      <div className='seam-body'>
        <div className='seam-model'>{model}</div>
        <TextButton>{t.deviceDetails}</TextButton>
      </div>
      <Button>Unlock</Button>
    </div>
  )
}

const t = {
  deviceDetails: 'Device details',
}
