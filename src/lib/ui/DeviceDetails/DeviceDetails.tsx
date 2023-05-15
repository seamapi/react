import { type CommonDeviceProperties, type Device } from 'seamapi'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useAccessCodes } from 'lib/seam/access-codes/use-access-codes.js'
import { isLockDevice } from 'lib/seam/devices/types.js'
import { AccessCodeTable } from 'lib/ui/AccessCodeTable/AccessCodeTable.js'
import { Alert } from 'lib/ui/Alert.js'
import { Button } from 'lib/ui/Button.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { DeviceModel } from 'lib/ui/DeviceDetails/DeviceModel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import useToggle from 'lib/use-toggle.js'

export interface DeviceDetailsProps {
  device: Device<CommonDeviceProperties>
  onBack?: () => void
}

export function DeviceDetails(props: DeviceDetailsProps): JSX.Element | null {
  const { device, onBack } = props

  const [accessCodesOpen, toggleAccessCodesOpen] = useToggle()

  const { isLoading, accessCodes } = useAccessCodes({
    device_id: device.device_id,
  })

  if (isLoading) {
    return null
  }

  if (accessCodesOpen) {
    return (
      <AccessCodeTable
        deviceId={device.device_id}
        onBack={toggleAccessCodesOpen}
      />
    )
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
          <Alert
            variant='warning'
            message='Lock is in Privacy Mode. Access Codes will not unlock doors.'
            action={{
              label: 'View setting',
              onClick: () => {},
            }}
            className='seam-alert-space-top'
          />
        </div>
        <div className='seam-box'>
          <div
            className='seam-content seam-access-codes'
            onClick={toggleAccessCodesOpen}
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
