import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { AddIcon } from 'lib/icons/Add.js'
import {
  useAccessCodes,
  type UseAccessCodesData,
} from 'lib/seam/access-codes/use-access-codes.js'
import { AccessCodeDetails } from 'lib/seam/components/AccessCodeDetails/AccessCodeDetails.js'
import {
  type AccessCodeFilter,
  AccessCodeHealthBar,
} from 'lib/seam/components/AccessCodeTable/AccessCodeHealthBar.js'
import { AccessCodeRow } from 'lib/seam/components/AccessCodeTable/AccessCodeRow.js'
import { CreateAccessCodeForm } from 'lib/seam/components/CreateAccessCodeForm/CreateAccessCodeForm.js'
import { EditAccessCodeForm } from 'lib/seam/components/EditAccessCodeForm/EditAccessCodeForm.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { useToggle } from 'lib/ui/use-toggle.js'

const disableCreateAccessCode = true
const disableEditAccessCode = true
const disableDeleteAccessCode = true

export interface AccessCodeTableProps {
  deviceId: string
  disableLockUnlock?: boolean
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
  onBack?: () => void
  heading?: string | null
  /**
   * @deprecated Use heading.
   */
  title?: string | null
  className?: string
}

type AccessCode = UseAccessCodesData[number]

const defaultAccessCodeFilter = (
  accessCode: AccessCode,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim()
  if (value === '') return true
  const searchRegex = new RegExp(value, 'i')
  return (
    searchRegex.test(accessCode?.name ?? '') ||
    searchRegex.test(accessCode?.code ?? '')
  )
}

export function AccessCodeTable({
  deviceId,
  disableLockUnlock = false,
  disableSearch = false,
  onAccessCodeClick = () => {},
  preventDefaultOnAccessCodeClick = false,
  onBack,
  accessCodeFilter = defaultAccessCodeFilter,
  accessCodeComparator = compareByCreatedAtDesc,
  heading = t.accessCodes,
  title = t.accessCodes,
  className,
}: AccessCodeTableProps): JSX.Element {
  const { accessCodes } = useAccessCodes({
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
      <EditAccessCodeForm
        accessCodeId={selectedEditAccessCodeId}
        className={className}
        onBack={() => {
          setSelectedEditAccessCodeId(null)
        }}
      />
    )
  }

  if (selectedViewAccessCodeId != null) {
    return (
      <AccessCodeDetails
        className={className}
        accessCodeId={selectedViewAccessCodeId}
        onBack={() => {
          setSelectedViewAccessCodeId(null)
        }}
        disableLockUnlock={disableLockUnlock}
        onEdit={() => {
          setSelectedEditAccessCodeId(selectedViewAccessCodeId)
        }}
      />
    )
  }

  if (addAccessCodeFormVisible) {
    return (
      <CreateAccessCodeForm
        className={className}
        onBack={toggleAddAccessCodeForm}
        deviceId={deviceId}
      />
    )
  }

  return (
    <div className={classNames('seam-access-code-table', className)}>
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
              className='seam-add-access-code-button'
            >
              <AddIcon />
            </IconButton>
          )}
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
        />
      </TableBody>
    </div>
  )
}

function Content(props: {
  accessCodes: Array<UseAccessCodesData[number]>
  onAccessCodeClick: (accessCodeId: string) => void
  onAccessCodeEdit: (accessCodeId: string) => void
  disableEditAccessCode: boolean
}): JSX.Element {
  const {
    accessCodes,
    onAccessCodeClick,
    onAccessCodeEdit,
    disableEditAccessCode,
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
}
