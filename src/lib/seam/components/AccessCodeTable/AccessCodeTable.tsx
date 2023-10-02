import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'

import { useComponentTelemetry } from 'lib/telemetry/index.js'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { AddIcon } from 'lib/icons/Add.js'
import {
  useAccessCodes,
  type UseAccessCodesData,
} from 'lib/seam/access-codes/use-access-codes.js'
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
  /**
   * @deprecated Use heading.
   */
  title?: string | null
}

type AccessCode = UseAccessCodesData[number]

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

export function AccessCodeTable({
  deviceId,
  disableSearch = false,
  onAccessCodeClick = () => {},
  preventDefaultOnAccessCodeClick = false,
  onBack,
  accessCodeFilter = defaultAccessCodeFilter,
  accessCodeComparator = compareByCreatedAtDesc,
  heading = t.accessCodes,
  title = t.accessCodes,
  className,
  disableCreateAccessCode = false,
  disableEditAccessCode = false,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
}: AccessCodeTableProps): JSX.Element {
  useComponentTelemetry('AccessCodeTable')

  const { accessCodes, isInitialLoading, isError, error, refetch } =
    useAccessCodes({
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

  if (selectedEditAccessCodeId != null) {
    return (
      <NestedEditAccessCodeForm
        accessCodeId={selectedEditAccessCodeId}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        onBack={() => {
          setSelectedEditAccessCodeId(null)
        }}
        className={className}
      />
    )
  }

  if (selectedViewAccessCodeId != null) {
    return (
      <NestedAccessCodeDetails
        accessCodeId={selectedViewAccessCodeId}
        onEdit={() => {
          setSelectedEditAccessCodeId(selectedViewAccessCodeId)
        }}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
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
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        onBack={toggleAddAccessCodeForm}
        className={className}
      />
    )
  }

  return (
    <div className={classNames('seam-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <div className='seam-left'>
          {title != null ? (
            <TableTitle>
              {heading ?? title ?? t.accessCodes}{' '}
              <Caption>({filteredAccessCodes.length})</Caption>
            </TableTitle>
          ) : (
            <div className='seam-fragment' />
          )}
          {!disableCreateAccessCode && (
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
          disableEditAccessCode={disableEditAccessCode}
          disableDeleteAccessCode={disableDeleteAccessCode}
        />
      </TableBody>

      {isError && (
        <Snackbar
          variant='error'
          message={error?.message ?? 'Access codes could not be loaded'}
          action={{
            label: 'Try again',
            onClick: refetch,
          }}
          isOpen={isError}
          onClose={() => {}}
          disableCloseButton
        />
      )}
    </div>
  )
}

function Content(props: {
  accessCodes: Array<UseAccessCodesData[number]>
  onAccessCodeClick: (accessCodeId: string) => void
  onAccessCodeEdit: (accessCodeId: string) => void
  disableEditAccessCode: boolean
  disableDeleteAccessCode: boolean
}): JSX.Element {
  const {
    accessCodes,
    onAccessCodeClick,
    onAccessCodeEdit,
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
        />
      ))}
    </>
  )
}

const t = {
  accessCodes: 'Access Codes',
  noAccessCodesMessage: 'Sorry, no access codes were found',
  loading: 'Loading access codes',
}
