import classNames from 'classnames'
import type { LockDevice } from 'seamapi'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useAccessCodes } from 'lib/seam/access-codes/use-access-codes.js'
import { NestedAccessCodeTable } from 'lib/seam/components/AccessCodeTable/AccessCodeTable.js'
import type { CommonProps } from 'lib/seam/components/common-props.js'
import { DeviceModel } from 'lib/seam/components/DeviceDetails/DeviceModel.js'
import { useToggleLock } from 'lib/seam/devices/use-toggle-lock.js'
import { deviceErrorFilter, deviceWarningFilter } from 'lib/seam/filters.js'
import { Alerts } from 'lib/ui/Alert/Alerts.js'
import { Button } from 'lib/ui/Button.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { useToggle } from 'lib/ui/use-toggle.js'

interface LockDeviceDetailsProps extends CommonProps {
  device: LockDevice
}

export function LockDeviceDetails(
  props: LockDeviceDetailsProps
): JSX.Element | null {
  const {
    device,
    errorFilter = () => true,
    warningFilter = () => true,
    disableLockUnlock,
    disableCreateAccessCode,
    disableEditAccessCode,
    disableDeleteAccessCode,
    disableResourceIds,
    disableClimateSettingSchedules,
    onBack,
    className,
  } = props

  const [accessCodesOpen, toggleAccessCodesOpen] = useToggle()
  const toggleLock = useToggleLock(device)
  const { accessCodes } = useAccessCodes({
    device_id: device.device_id,
  })

  const lockStatus = device.properties.locked ? t.locked : t.unlocked
  const toggleLockLabel = device.properties.locked ? t.unlock : t.lock

  const accessCodeCount = accessCodes?.length

  if (accessCodes == null) {
    return null
  }

  if (accessCodesOpen) {
    return (
      <NestedAccessCodeTable
        deviceId={device.device_id}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        disableClimateSettingSchedules={disableClimateSettingSchedules}
        onBack={toggleAccessCodesOpen}
        className={className}
      />
    )
  }

  const alerts = [
    ...device.errors
      .filter(deviceErrorFilter)
      .filter(errorFilter)
      .map((error) => ({
        variant: 'error' as const,
        message: error.message,
      })),
    ...device.warnings
      .filter(deviceWarningFilter)
      .filter(warningFilter)
      .map((warning) => ({
        variant: 'warning' as const,
        message: warning.message,
      })),
  ]

  return (
    <div className={classNames('seam-device-details', className)}>
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
          <Alerts alerts={alerts} className='seam-alerts-space-top' />
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
              {disableLockUnlock !== true &&
                device.capabilities_supported.includes('lock') && (
                  <Button
                    size='small'
                    onClick={() => {
                      toggleLock.mutate()
                    }}
                  >
                    {toggleLockLabel}
                  </Button>
                )}
            </div>
          </div>
          <AccessCodeLength
            supportedCodeLengths={
              device.properties?.supported_code_lengths ?? []
            }
          />
        </div>
      </div>
    </div>
  )
}

function AccessCodeLength(props: {
  supportedCodeLengths: number[]
}): JSX.Element | null {
  const { supportedCodeLengths } = props

  if (supportedCodeLengths.length === 0) {
    return null
  }

  const min = Math.min(...supportedCodeLengths)
  const max = Math.max(...supportedCodeLengths)

  const range = min === max ? max : `${min}–${max}`

  return (
    <div className='seam-content seam-access-code-length'>
      <span className='seam-label'>{t.codeLength}</span>
      <span className='seam-value'>
        {range} {t.digits}
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
