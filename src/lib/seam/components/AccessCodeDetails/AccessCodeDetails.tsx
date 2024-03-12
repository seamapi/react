import classNames from 'classnames'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import { useComponentTelemetry } from 'lib/telemetry/index.js'

import { CopyIcon } from 'lib/icons/Copy.js'
import { useAccessCode } from 'lib/seam/access-codes/use-access-code.js'
import { useDeleteAccessCode } from 'lib/seam/access-codes/use-delete-access-code.js'
import { AccessCodeDevice } from 'lib/seam/components/AccessCodeDetails/AccessCodeDevice.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { NestedDeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import {
  accessCodeErrorFilter,
  accessCodeWarningFilter,
} from 'lib/seam/filters.js'
import { Alerts } from 'lib/ui/Alert/Alerts.js'
import { Button } from 'lib/ui/Button.js'
import { copyToClipboard } from 'lib/ui/clipboard.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { useIsDateInPast } from 'lib/ui/use-is-date-in-past.js'

export interface AccessCodeDetailsProps extends CommonProps {
  accessCodeId: string
  onEdit: () => void
}

export const NestedAccessCodeDetails =
  withRequiredCommonProps(AccessCodeDetails)

export function AccessCodeDetails({
  accessCodeId,
  onEdit,
  errorFilter = () => true,
  warningFilter = () => true,
  disableCreateAccessCode = false,
  disableEditAccessCode = false,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
  disableResourceIds = false,
  disableClimateSettingSchedules,
  onBack,
  className,
}: AccessCodeDetailsProps): JSX.Element | null {
  useComponentTelemetry('AccessCodeDetails')

  const { accessCode } = useAccessCode(accessCodeId)
  const [selectedDeviceId, selectDevice] = useState<string | null>(null)
  const { mutate: deleteCode, isPending: isDeleting } = useDeleteAccessCode()

  if (accessCode == null) {
    return null
  }

  const name = accessCode.name ?? t.fallbackName

  if (selectedDeviceId != null) {
    return (
      <NestedDeviceDetails
        deviceId={selectedDeviceId}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        disableClimateSettingSchedules={disableClimateSettingSchedules}
        onBack={() => {
          selectDevice(null)
        }}
        className={className}
      />
    )
  }

  const alerts = [
    ...accessCode.errors
      .filter(accessCodeErrorFilter)
      .filter(errorFilter)
      .map((error) => ({
        variant: 'error' as const,
        message: error.message,
      })),

    ...accessCode.warnings
      .filter(accessCodeWarningFilter)
      .filter(warningFilter)
      .map((warning) => ({
        variant: 'warning' as const,
        message: warning.message,
      })),
  ]

  return (
    <div className={classNames('seam-access-code-details', className)}>
      <ContentHeader title='Access code' onBack={onBack} />
      <div className='seam-summary'>
        <div
          className={classNames(
            'seam-top',
            alerts.length > 0 && 'seam-top-has-alerts'
          )}
        >
          <span className='seam-label'>{t.accessCode}</span>
          <h5 className='seam-access-code-name'>{name}</h5>
          <div className='seam-code'>
            <span>{accessCode.code}</span>
            <IconButton
              onClick={() => {
                void copyToClipboard(accessCode.code ?? '')
              }}
            >
              <CopyIcon />
            </IconButton>
          </div>
          <div className='seam-duration'>
            <Duration accessCode={accessCode} />
          </div>
        </div>
        <Alerts alerts={alerts} className='seam-alerts-padded' />
        <AccessCodeDevice
          deviceId={accessCode.device_id}
          disableLockUnlock={disableLockUnlock}
          onSelectDevice={selectDevice}
        />
      </div>
      {(!disableEditAccessCode || !disableDeleteAccessCode) && (
        <div className='seam-actions'>
          {!disableEditAccessCode && (
            <Button size='small' onClick={onEdit} disabled={isDeleting}>
              {t.editCode}
            </Button>
          )}
          {!disableDeleteAccessCode && (
            <Button
              size='small'
              onClick={() => {
                deleteCode({ access_code_id: accessCode.access_code_id })
              }}
              disabled={isDeleting}
            >
              {t.deleteCode}
            </Button>
          )}
        </div>
      )}
      <div className='seam-details'>
        {!disableResourceIds && (
          <div className='seam-row'>
            <div className='seam-heading'>{t.id}:</div>
            <div className='seam-content seam-code-id'>
              <span>{accessCode.access_code_id}</span>
              <IconButton
                onClick={() => {
                  void copyToClipboard(accessCode.access_code_id)
                }}
              >
                <CopyIcon />
              </IconButton>
            </div>
          </div>
        )}
        <div className='seam-row'>
          <div className='seam-heading'>{t.created}:</div>
          <div className='seam-content'>
            {formatDate(accessCode.created_at)}
          </div>
        </div>

        <div className='seam-row seam-schedule'>
          <div className='seam-heading'>{t.timing}:</div>
          <div className='seam-content'>
            <ScheduleInfo accessCode={accessCode} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ScheduleInfo({ accessCode }: { accessCode: AccessCode }): JSX.Element {
  if (accessCode.type === 'ongoing') {
    return <span>{t.ongoing}</span>
  }
  return (
    <div className='seam-times'>
      <div>
        <div className='seam-label'>{t.start}</div>
        <div className='seam-date'>{formatDate(accessCode.starts_at)}</div>
        <div className='seam-time'>{formatTime(accessCode.starts_at)}</div>
      </div>
      <div>
        <div className='seam-label'>{t.end}</div>
        <div className='seam-date'>{formatDate(accessCode.ends_at)}</div>
        <div className='seam-time'>{formatTime(accessCode.ends_at)}</div>
      </div>
    </div>
  )
}

function Duration(props: { accessCode: AccessCode }): JSX.Element {
  const { accessCode } = props

  const hasStarted =
    useIsDateInPast('starts_at' in accessCode ? accessCode?.starts_at : null) ??
    false

  if (accessCode.type === 'ongoing') {
    return (
      <span>
        <span className='seam-label'>Active</span> (ongoing)
      </span>
    )
  }

  if (hasStarted) {
    return (
      <span>
        <span className='seam-label'>Active</span> until{' '}
        {formatDurationDate(accessCode.ends_at)} at{' '}
        {formatTime(accessCode.ends_at)}
      </span>
    )
  }

  return (
    <span>
      Starts {formatDurationDate(accessCode.starts_at)} as{' '}
      {formatTime(accessCode.starts_at)}
    </span>
  )
}

const formatDurationDate = (date: string): string =>
  DateTime.fromISO(date).toLocaleString({
    month: 'short',
    day: 'numeric',
  })

const formatTime = (date: string): string =>
  DateTime.fromISO(date).toLocaleString({
    hour: 'numeric',
    minute: '2-digit',
  })

const formatDate = (date: string): string =>
  DateTime.fromISO(date).toLocaleString({
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

const t = {
  accessCode: 'Access code',
  fallbackName: 'Code',
  id: 'ID',
  created: 'Created',
  timing: 'Timing',
  ongoing: 'Ongoing',
  start: 'Start',
  end: 'End',
  editCode: 'Edit code',
  deleteCode: 'Delete code',
}
