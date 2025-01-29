import classNames from 'classnames'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useAccessCodes } from 'lib/seam/access-codes/use-access-codes.js'
import { NestedAccessCodeTable } from 'lib/seam/components/AccessCodeTable/AccessCodeTable.js'
import type { NestedSpecificDeviceDetailsProps } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { DeviceInfo } from 'lib/seam/components/DeviceDetails/DeviceInfo.js'
import { DeviceModel } from 'lib/seam/components/DeviceDetails/DeviceModel.js'
import { deviceErrorFilter, deviceWarningFilter } from 'lib/seam/filters.js'
import type { LockDevice } from 'lib/seam/locks/lock-device.js'
import { useToggleLock } from 'lib/seam/locks/use-toggle-lock.js'
import { Alerts } from 'lib/ui/Alert/Alerts.js'
import { Button } from 'lib/ui/Button.js'
import { BatteryStatusIndicator } from 'lib/ui/device/BatteryStatusIndicator.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { EditableDeviceName } from 'lib/ui/device/EditableDeviceName.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { useToggle } from 'lib/ui/use-toggle.js'

interface LockDeviceDetailsProps extends NestedSpecificDeviceDetailsProps {
  device: LockDevice
  onEditName?: (newName: string) => void | Promise<void>
}

export function LockDeviceDetails({
  device,
  errorFilter,
  warningFilter,
  disableLockUnlock,
  disableCreateAccessCode,
  disableEditAccessCode,
  disableDeleteAccessCode,
  disableResourceIds,
  disableConnectedAccountInformation,
  onBack,
  className,
  onEditName,
}: LockDeviceDetailsProps): JSX.Element | null {
  const [accessCodesOpen, toggleAccessCodesOpen] = useToggle()
  const toggleLock = useToggleLock()
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
        disableConnectedAccountInformation={disableConnectedAccountInformation}
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
              <EditableDeviceName
                tagName='h4'
                value={device.properties.name}
                className='seam-device-name'
                onEdit={onEditName}
              />
              <div className='seam-properties'>
                <span className='seam-label'>{t.status}:</span>{' '}
                <OnlineStatus device={device} />
                {device.properties.online && (
                  <>
                    <span className='seam-label'>{t.power}:</span>{' '}
                    <BatteryStatusIndicator device={device} />
                  </>
                )}
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
          {device.properties.locked && device.properties.online && (
            <div className='seam-content seam-lock-status'>
              <div>
                <span className='seam-label'>{t.lockStatus}</span>
                <span className='seam-value'>{lockStatus}</span>
              </div>
              <div className='seam-right'>
                {!disableLockUnlock &&
                  device.capabilities_supported.includes('lock') && (
                    <Button
                      size='small'
                      onClick={() => {
                        toggleLock.mutate(device)
                      }}
                    >
                      {toggleLockLabel}
                    </Button>
                  )}
              </div>
            </div>
          )}

          <AccessCodeLength
            supportedCodeLengths={
              device.properties?.supported_code_lengths ?? []
            }
          />
        </div>
        <DeviceInfo
          device={device}
          disableConnectedAccountInformation={
            disableConnectedAccountInformation
          }
          disableResourceIds={disableResourceIds}
        />
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
