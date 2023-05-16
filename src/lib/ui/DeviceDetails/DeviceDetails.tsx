import type { LockDevice } from 'seamapi'

import { useDevice } from 'lib/index.js'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useAccessCodes } from 'lib/seam/access-codes/use-access-codes.js'
import { isLockDevice } from 'lib/seam/devices/types.js'
import { useToggleLock } from 'lib/seam/devices/use-toggle-lock.js'
import { AccessCodeTable } from 'lib/ui/AccessCodeTable/AccessCodeTable.js'
import { Button } from 'lib/ui/Button.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { DeviceModel } from 'lib/ui/DeviceDetails/DeviceModel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import useToggle from 'lib/use-toggle.js'

export interface DeviceDetailsProps {
  deviceId: string
  onBack?: () => void
}

export function DeviceDetails(props: DeviceDetailsProps): JSX.Element | null {
  const { deviceId, onBack } = props

  const { device } = useDevice({
    device_id: deviceId,
  })

  if (device == null) {
    return null
  }

  if (!isLockDevice(device)) {
    return null
  }

  return <LockDeviceDetails device={device} onBack={onBack} />
}

function LockDeviceDetails(props: { device: LockDevice; onBack?: () => void }) {
  const { device, onBack } = props
  const [accessCodesOpen, toggleAccessCodesOpen] = useToggle()
  const toggleLock = useToggleLock(device)
  const { accessCodes } = useAccessCodes({
    device_id: device.device_id,
  })

  const lockStatus = device.properties.locked ? t.locked : t.unlocked
  const toggleLockLabel = device.properties.locked ? t.unlock : t.lock

  const accessCodeCount = accessCodes?.length

  const accessCodeLength =
    device.properties?.schlage_metadata?.access_code_length

  if (accessCodes == null) {
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
              <Button
                size='small'
                onClick={() => {
                  toggleLock.mutate()
                }}
              >
                {toggleLockLabel}
              </Button>
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
  lock: 'Lock',
  locked: 'Locked',
  unlocked: 'Unlocked',
  accessCodes: 'access codes',
  codeLength: 'Code length',
  digits: 'digits',
  lockStatus: 'Lock status',
  status: 'Status',
  power: 'Power',
}
