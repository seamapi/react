import type { AccessCode } from '@seamapi/types/connect'
import classNames from 'classnames'
import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'

import { CopyIcon } from 'lib/icons/Copy.js'
import { useAccessCode } from 'lib/seam/access-codes/use-access-code.js'
import { useDeleteAccessCode } from 'lib/seam/access-codes/use-delete-access-code.js'
import { AccessCodeDevice } from 'lib/seam/components/AccessCodeDetails/AccessCodeDevice.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { NestedDeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { NestedEditAccessCodeForm } from 'lib/seam/components/EditAccessCodeForm/EditAccessCodeForm.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import {
  accessCodeErrorFilter,
  accessCodeWarningFilter,
} from 'lib/seam/filters.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'
import { Alerts } from 'lib/ui/Alert/Alerts.js'
import { Button } from 'lib/ui/Button.js'
import { copyToClipboard } from 'lib/ui/clipboard.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'
import { useIsDateInPast } from 'lib/ui/use-is-date-in-past.js'

export interface AccessCodeDetailsProps extends CommonProps {
  accessCodeId: string
  onEdit?: () => void
  preventDefaultOnEdit?: boolean
  onDelete?: () => void
  preventDefaultOnDelete?: boolean
}

export const NestedAccessCodeDetails =
  withRequiredCommonProps(AccessCodeDetails)

export function AccessCodeDetails({
  accessCodeId,
  onEdit,
  preventDefaultOnEdit = false,
  onDelete,
  preventDefaultOnDelete = false,
  errorFilter = () => true,
  warningFilter = () => true,
  disableCreateAccessCode = false,
  disableEditAccessCode = false,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
  disableResourceIds = false,
  disableConnectedAccountInformation = false,
  onBack,
  className,
}: AccessCodeDetailsProps): JSX.Element | null {
  useComponentTelemetry('AccessCodeDetails')

  const { accessCode } = useAccessCode({ access_code_id: accessCodeId })
  const [selectedDeviceId, selectDevice] = useState<string | null>(null)
  const { mutate: deleteCode, isPending: isDeleting } = useDeleteAccessCode()
  const [editFormOpen, setEditFormOpen] = useState<boolean>(false)

  const [accessCodeResult, setAccessCodeResult] = useState<
    'updated' | 'deleted' | null
  >(null)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')

  // Circumvent Snackbar bug that causes it to switch to default message
  // while the dismiss animation is playing
  useEffect(() => {
    if (accessCodeResult !== null) {
      setSnackbarMessage(accessCodeResultToMessage(accessCodeResult))
    }
  }, [accessCodeResult])

  const handleEdit = useCallback((): void => {
    onEdit?.()
    if (preventDefaultOnEdit) return
    setEditFormOpen(true)
  }, [onEdit, preventDefaultOnEdit, setEditFormOpen])

  const handleDelete = useCallback((): void => {
    onDelete?.()
    if (preventDefaultOnDelete) return
    if (accessCode == null) return
    deleteCode(
      { access_code_id: accessCode.access_code_id },
      {
        onSuccess: () => {
          setAccessCodeResult('deleted')
        },
      }
    )
  }, [accessCode, deleteCode, onDelete, preventDefaultOnDelete])

  const { device } = useDevice({ device_id: accessCode?.device_id })
  const canSpecifyPinCode =
    device?.properties.code_constraints?.every(
      ({ constraint_type: type }) => type !== 'cannot_specify_pin_code'
    ) ?? true

  if (accessCode == null) {
    return null
  }

  const name = accessCode.name ?? t.fallbackName
  const isAccessCodeBeingRemoved = accessCode.status === 'removing'

  if (editFormOpen) {
    return (
      <NestedEditAccessCodeForm
        accessCodeId={accessCode.access_code_id}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        disableConnectedAccountInformation={disableConnectedAccountInformation}
        onBack={() => {
          setEditFormOpen(false)
        }}
        onSuccess={() => {
          setAccessCodeResult('updated')
          setEditFormOpen(false)
        }}
        className={className}
      />
    )
  }

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
        disableConnectedAccountInformation={disableConnectedAccountInformation}
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

    ...(isAccessCodeBeingRemoved
      ? [
          {
            variant: 'warning' as const,
            message: t.warningRemoving,
          },
        ]
      : []),
  ]

  return (
    <>
      <Snackbar
        variant='success'
        message={snackbarMessage}
        visible={accessCodeResult != null}
        autoDismiss
        onClose={() => {
          setAccessCodeResult(null)
        }}
      />
      <div className={classNames('seam-access-code-details', className)}>
        <ContentHeader title='Access code' onBack={onBack} />
        <div className='seam-summary'>
          <div
            className={classNames(
              'seam-top',
              alerts.length > 0 && 'seam-top-has-alerts'
            )}
          >
            {canSpecifyPinCode && (
              <>
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
              </>
            )}

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

        {canSpecifyPinCode &&
          (!disableEditAccessCode || !disableDeleteAccessCode) && (
            <div className='seam-actions'>
              {!disableEditAccessCode && !accessCode.is_offline_access_code && (
                <Button
                  size='small'
                  onClick={handleEdit}
                  disabled={isAccessCodeBeingRemoved || isDeleting}
                >
                  {t.editCode}
                </Button>
              )}
              {!disableDeleteAccessCode &&
                !accessCode.is_offline_access_code && (
                  <Button
                    size='small'
                    onClick={handleDelete}
                    disabled={isAccessCodeBeingRemoved || isDeleting}
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
    </>
  )
}

function ScheduleInfo({ accessCode }: { accessCode: AccessCode }): JSX.Element {
  if (accessCode.type === 'ongoing') {
    return <span>{t.ongoing}</span>
  }
  return (
    <div className='seam-times'>
      {accessCode.starts_at != null && (
        <div>
          <div className='seam-label'>{t.start}</div>
          <div className='seam-date'>{formatDate(accessCode.starts_at)}</div>
          <div className='seam-time'>{formatTime(accessCode.starts_at)}</div>
        </div>
      )}
      {accessCode.ends_at != null && (
        <div>
          <div className='seam-label'>{t.end}</div>
          <div className='seam-date'>{formatDate(accessCode.ends_at)}</div>
          <div className='seam-time'>{formatTime(accessCode.ends_at)}</div>
        </div>
      )}
    </div>
  )
}

function Duration(props: { accessCode: AccessCode }): JSX.Element | null {
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

  if (hasStarted && accessCode.ends_at != null) {
    return (
      <span>
        <span className='seam-label'>{t.active}</span> {t.until}{' '}
        {formatDurationDate(accessCode.ends_at)} {t.at}{' '}
        {formatTime(accessCode.ends_at)}
      </span>
    )
  }

  if (accessCode.starts_at != null) {
    return (
      <span>
        {t.starts} {formatDurationDate(accessCode.starts_at)} {t.as}{' '}
        {formatTime(accessCode.starts_at)}
      </span>
    )
  }

  return null
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

const accessCodeResultToMessage = (result: 'updated' | 'deleted'): string => {
  if (result === 'deleted') return t.accessCodeDeleted
  return t.accessCodeUpdated
}

const t = {
  accessCode: 'Access code',
  fallbackName: 'Code',
  id: 'ID',
  created: 'Created',
  timing: 'Timing',
  ongoing: 'Ongoing',
  start: 'Start',
  end: 'End',
  starts: 'Starts',
  active: 'Active',
  until: 'until',
  as: 'as',
  at: 'at',
  editCode: 'Edit code',
  deleteCode: 'Delete code',
  warningRemoving: 'This access code is currently being removed.',
  accessCodeUpdated: 'Access code updated',
  accessCodeDeleted: 'Access code is being removed',
}
