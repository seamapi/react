import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useNavigation } from 'lib/NavigationProvider.js'
import { useAccessCodes } from 'lib/seam/access-codes/use-access-codes.js'
import { isLockDevice } from 'lib/seam/devices/types.js'
import { useFakeDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { DeviceModel } from 'lib/ui/DeviceDetails/DeviceModel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

export interface DeviceDetailsProps {
  deviceId: string
  onBack?: () => void
}

export function DeviceDetails(props: DeviceDetailsProps): JSX.Element | null {
  const { deviceId, onBack } = props

  const { isLoading: isLoadingDevice, device } = useFakeDevice({
    device_id: deviceId,
  })

  const { isLoading: isLoadingAccessCodes, accessCodes } = useAccessCodes({
    device_id: deviceId,
  })

  const isLoading = isLoadingDevice || isLoadingAccessCodes

  const { show } = useNavigation()

  if (isLoading || !device) {
    return null
  }

  if (!isLockDevice(device)) {
    return null
  }

  const lockStatus = device.properties.locked ? t.locked : t.unlocked

  const accessCodeCount = accessCodes?.length

  const accessCodeLength =
    device.properties?.schlage_metadata?.access_code_length

  return (
    <div className='seam-device-details'>
      <ContentHeader title='Device' onBack={onBack} />
      <div className='seam-body'>
        <div className='seam-summary'>
          <div className='seam-content'>
            <div className='seam-image'>
              <DeviceImage device={device} />
            </div>
            <div className='seam-info'>
              <span className='seam-label'>{t.device}</span>
              <h4 className='seam-device-name'>{device.properties.name}</h4>
              <div className='seam-properties'>
                <span className='seam-label'>{t.status}:</span>{' '}
                <OnlineStatus device={device} />
                <span className='seam-label'>{t.power}:</span>{' '}
                <BatteryStatus device={device} />
                <DeviceModel device={device} />
              </div>
            </div>
          </div>
        </div>
        <div className='seam-box'>
          <div
            className='seam-content seam-access-codes'
            onClick={() => {
              show({ name: 'access_code_table', deviceId: device.device_id })
            }}
          >
            <span className='seam-value'>
              {accessCodeCount} {t.accessCodes}
            </span>
            <ChevronRightIcon />
          </div>
        </div>

        <div className='seam-box'>
          <div className='seam-content seam-lock-status'>
            <div>
              <span className='seam-label'>{t.lockStatus}</span>
              <span className='seam-value'>{lockStatus}</span>
            </div>
            <div className='seam-right'>
              <Button size='small'>{t.unlock}</Button>
            </div>
          </div>
          <AccessCodeLength accessCodeLength={accessCodeLength} />
        </div>
      </div>
    </div>
  )
}

function AccessCodeLength(props: {
  accessCodeLength: number | null | undefined
}): JSX.Element | null {
  const { accessCodeLength } = props
  if (accessCodeLength == null) {
    return null
  }

  return (
    <div className='seam-content seam-access-code-length'>
      <span className='seam-label'>{t.codeLength}</span>
      <span className='seam-value'>
        {accessCodeLength} {t.digits}
      </span>
    </div>
  )
}

const t = {
  device: 'Device',
  unlock: 'Unlock',
  locked: 'Locked',
  unlocked: 'Unlocked',
  accessCodes: 'access codes',
  codeLength: 'Code length',
  digits: 'digits',
  lockStatus: 'Lock status',
  status: 'Status',
  power: 'Power',
}
