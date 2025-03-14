import type { AccessCode } from '@seamapi/types/connect'
import classNames from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { AddIcon } from 'lib/icons/Add.js'
import { useDevice } from 'lib/index.js'
import { useAccessCodes } from 'lib/seam/access-codes/use-access-codes.js'
import { NestedAccessCodeDetails } from 'lib/seam/components/AccessCodeDetails/AccessCodeDetails.js'
import {
  type AccessCodeFilter,
  AccessCodeHealthBar,
} from 'lib/seam/components/AccessCodeTable/AccessCodeHealthBar.js'
import { AccessCodeRow } from 'lib/seam/components/AccessCodeTable/AccessCodeRow.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { NestedCreateAccessCodeForm } from 'lib/seam/components/CreateAccessCodeForm/CreateAccessCodeForm.js'
import { NestedEditAccessCodeForm } from 'lib/seam/components/EditAccessCodeForm/EditAccessCodeForm.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { LoadingToast } from 'lib/ui/LoadingToast/LoadingToast.js'
import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { useToggle } from 'lib/ui/use-toggle.js'

export const NestedAccessCodeTable = withRequiredCommonProps(AccessCodeTable)

export interface AccessCodeTableProps extends CommonProps {
  deviceId: string
  disableSearch?: boolean
  accessCodeFilter?: (
    accessCode: AccessCode,
    searchInputValue: string
  ) => boolean
  accessCodeComparator?: (
    accessCodeA: AccessCode,
    accessCodeB: AccessCode
  ) => number
  onAccessCodeClick?: (accessCodeId: string) => void
  preventDefaultOnAccessCodeClick?: boolean
  heading?: string | null
}

export function AccessCodeTable({
  deviceId,
  disableSearch = false,
  onAccessCodeClick = () => {},
  preventDefaultOnAccessCodeClick = false,
  onBack,
  accessCodeFilter = defaultAccessCodeFilter,
  accessCodeComparator = compareByCreatedAtDesc,
  errorFilter = () => true,
  warningFilter = () => true,
  heading = t.accessCodes,
  className,
  disableCreateAccessCode = false,
  disableEditAccessCode = false,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
  disableResourceIds = false,
  disableConnectedAccountInformation = false,
}: AccessCodeTableProps): JSX.Element {
  useComponentTelemetry('AccessCodeTable')

  const { accessCodes, isInitialLoading, isError, refetch } = useAccessCodes({
    device_id: deviceId,
  })

  const { device } = useDevice({
    device_id: deviceId,
  })

  const [selectedViewAccessCodeId, setSelectedViewAccessCodeId] = useState<
    string | null
  >(null)

  const [searchInputValue, setSearchInputValue] = useState('')
  const [addAccessCodeFormVisible, toggleAddAccessCodeForm] = useToggle()
  const [selectedEditAccessCodeId, setSelectedEditAccessCodeId] = useState<
    string | null
  >(null)

  const filteredAccessCodes = useMemo(
    () =>
      accessCodes
        ?.filter((accessCode) => accessCodeFilter(accessCode, searchInputValue))
        ?.sort(accessCodeComparator) ?? [],
    [accessCodes, searchInputValue, accessCodeFilter, accessCodeComparator]
  )

  const handleAccessCodeClick = useCallback(
    (accessCodeId: string): void => {
      onAccessCodeClick(accessCodeId)
      if (preventDefaultOnAccessCodeClick) return
      setSelectedViewAccessCodeId(accessCodeId)
    },
    [
      onAccessCodeClick,
      preventDefaultOnAccessCodeClick,
      setSelectedViewAccessCodeId,
    ]
  )

  const handleAccessCodeEdit = useCallback(
    (accessCodeId: string): void => {
      setSelectedEditAccessCodeId(accessCodeId)
    },
    [setSelectedEditAccessCodeId]
  )

  const [accessCodeResult, setAccessCodeResult] = useState<
    'created' | 'updated' | 'deleted' | null
  >(null)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')

  const handleAccessCodeDeleteSuccess = useCallback((): void => {
    setAccessCodeResult('deleted')
  }, [setAccessCodeResult])

  // Circumvent Snackbar bug that causes it to switch to default message
  // while the dismiss animation is playing
  useEffect(() => {
    if (accessCodeResult !== null) {
      setSnackbarMessage(accessCodeResultToMessage(accessCodeResult))
    }
  }, [accessCodeResult])

  if (device == null) {
    return <></>
  }

  if (selectedEditAccessCodeId != null) {
    return (
      <NestedEditAccessCodeForm
        accessCodeId={selectedEditAccessCodeId}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        disableConnectedAccountInformation={disableConnectedAccountInformation}
        onBack={() => {
          setSelectedEditAccessCodeId(null)
        }}
        onSuccess={() => {
          setAccessCodeResult('updated')
        }}
        className={className}
      />
    )
  }

  if (selectedViewAccessCodeId != null) {
    return (
      <NestedAccessCodeDetails
        accessCodeId={selectedViewAccessCodeId}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        disableConnectedAccountInformation={disableConnectedAccountInformation}
        onBack={() => {
          setSelectedViewAccessCodeId(null)
        }}
        className={className}
      />
    )
  }

  if (addAccessCodeFormVisible) {
    return (
      <NestedCreateAccessCodeForm
        deviceId={deviceId}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        disableConnectedAccountInformation={disableConnectedAccountInformation}
        onBack={toggleAddAccessCodeForm}
        className={className}
        onSuccess={() => {
          setAccessCodeResult('created')
        }}
      />
    )
  }

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
      <div className={classNames('seam-table', className)}>
        <ContentHeader onBack={onBack} />
        <TableHeader>
          <div className='seam-left'>
            {heading != null ? (
              <TableTitle>
                {heading} <Caption>({filteredAccessCodes.length})</Caption>
              </TableTitle>
            ) : (
              <div className='seam-fragment' />
            )}
            {!disableCreateAccessCode &&
              (device.properties.online_access_codes_enabled === true ||
                device.can_program_online_access_codes === true) && (
                <IconButton
                  onClick={toggleAddAccessCodeForm}
                  className='seam-add-button'
                >
                  <AddIcon />
                </IconButton>
              )}
          </div>
          <div className='seam-table-header-loading-wrap'>
            <LoadingToast
              isLoading={isInitialLoading}
              label={t.loading}
              top={-20}
            />
          </div>
          {!disableSearch && (
            <SearchTextField
              value={searchInputValue}
              onChange={setSearchInputValue}
              disabled={(accessCodes?.length ?? 0) === 0}
            />
          )}
        </TableHeader>
        <TableBody>
          <Content
            accessCodes={filteredAccessCodes}
            onAccessCodeClick={handleAccessCodeClick}
            onAccessCodeEdit={handleAccessCodeEdit}
            onAccessCodeDeleteSuccess={handleAccessCodeDeleteSuccess}
            errorFilter={errorFilter}
            warningFilter={warningFilter}
            disableEditAccessCode={disableEditAccessCode}
            disableDeleteAccessCode={disableDeleteAccessCode}
          />
        </TableBody>

        <Snackbar
          variant='error'
          visible={isError}
          message={t.fallbackErrorMessage}
          action={{
            label: t.tryAgain,
            onClick: () => {
              void refetch()
            },
          }}
          disableCloseButton
        />
      </div>
    </>
  )
}

function Content(props: {
  accessCodes: AccessCode[]
  onAccessCodeClick: (accessCodeId: string) => void
  onAccessCodeEdit: (accessCodeId: string) => void
  onAccessCodeDeleteSuccess: (accessCodeId: string) => void
  errorFilter: (error: AccessCode['errors'][number]) => boolean
  warningFilter: (warning: AccessCode['warnings'][number]) => boolean
  disableEditAccessCode: boolean
  disableDeleteAccessCode: boolean
}): JSX.Element {
  const {
    accessCodes,
    onAccessCodeClick,
    onAccessCodeEdit,
    onAccessCodeDeleteSuccess,
    errorFilter,
    warningFilter,
    disableEditAccessCode,
    disableDeleteAccessCode,
  } = props
  const [filter, setFilter] = useState<AccessCodeFilter | null>(null)

  const filteredAccessCodes = useMemo(() => {
    if (filter === null) {
      return accessCodes
    }

    if (filter === 'access_code_issues') {
      return accessCodes.filter((accessCode) => {
        return accessCode.errors.length > 0 || accessCode.warnings.length > 0
      })
    }

    return accessCodes
  }, [accessCodes, filter])

  if (accessCodes.length === 0) {
    return <EmptyPlaceholder>{t.noAccessCodesMessage}</EmptyPlaceholder>
  }

  return (
    <>
      <AccessCodeHealthBar
        accessCodes={accessCodes}
        filter={filter}
        onFilterSelect={setFilter}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
      />
      {filteredAccessCodes.map((accessCode) => (
        <AccessCodeRow
          key={accessCode.access_code_id}
          accessCode={accessCode}
          onClick={() => {
            onAccessCodeClick(accessCode.access_code_id)
          }}
          disableEditAccessCode={disableEditAccessCode}
          disableDeleteAccessCode={disableDeleteAccessCode}
          onEdit={() => {
            onAccessCodeEdit(accessCode.access_code_id)
          }}
          onDeleteSuccess={() => {
            onAccessCodeDeleteSuccess(accessCode.access_code_id)
          }}
        />
      ))}
    </>
  )
}

const defaultAccessCodeFilter = (
  accessCode: AccessCode,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim().toLowerCase()
  if (value === '') return true
  const name = accessCode.name ?? ''
  const code = accessCode.code ?? ''
  return (
    name.trim().toLowerCase().includes(value) ||
    code.trim().toLowerCase().includes(value)
  )
}

const accessCodeResultToMessage = (
  result: 'created' | 'updated' | 'deleted'
): string => {
  if (result === 'created') return t.accessCodeCreated
  if (result === 'deleted') return t.accessCodeDeleted
  return t.accessCodeUpdated
}

const t = {
  accessCodes: 'Access Codes',
  noAccessCodesMessage: 'Sorry, no access codes were found',
  loading: 'Loading access codes',
  accessCodeUpdated: 'Access code updated',
  accessCodeCreated: 'Access code created',
  accessCodeDeleted: 'Access code is being removed',
  tryAgain: 'Try again',
  fallbackErrorMessage: 'Access codes could not be loaded',
}
