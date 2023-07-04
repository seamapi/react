import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { CopyIcon } from 'lib/icons/Copy.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import { TriangleWarningOutlineIcon } from 'lib/icons/TriangleWarningOutline.js'
import {
  useAccessCodes,
  type UseAccessCodesData,
} from 'lib/seam/access-codes/use-access-codes.js'
import { AccessCodeAddForm } from 'lib/seam/components/AccessCodeAddForm/AccessCodeAddForm.js'
import { AccessCodeDetails } from 'lib/seam/components/AccessCodeDetails/AccessCodeDetails.js'
import {
  type AccessCodeFilter,
  AccessCodeHealthBar,
} from 'lib/seam/components/AccessCodeTable/AccessCodeHealthBar.js'
import { CodeDetails } from 'lib/seam/components/AccessCodeTable/CodeDetails.js'
import { copyToClipboard } from 'lib/ui/clipboard.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'
import { MoreActionsMenu } from 'lib/ui/Menu/MoreActionsMenu.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'
import { useToggle } from 'lib/ui/use-toggle.js'

export interface AccessCodeTableProps {
  deviceId: string
  disableLockUnlock?: boolean
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
  onAccessCodeClick = () => {},
  preventDefaultOnAccessCodeClick = false,
  onBack,
  accessCodeFilter = defaultAccessCodeFilter,
  accessCodeComparator = compareByCreatedAtDesc,
  className,
}: AccessCodeTableProps): JSX.Element {
  const { accessCodes } = useAccessCodes({
    device_id: deviceId,
  })

  const [selectedAccessCodeId, setSelectedAccessCodeId] = useState<
    string | null
  >(null)

  const [searchInputValue, setSearchInputValue] = useState('')
  const [isAddMode, toggleAddMode] = useToggle()

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
      setSelectedAccessCodeId(accessCodeId)
    },
    [
      onAccessCodeClick,
      preventDefaultOnAccessCodeClick,
      setSelectedAccessCodeId,
    ]
  )

  if (selectedAccessCodeId != null) {
    return (
      <AccessCodeDetails
        className={className}
        accessCodeId={selectedAccessCodeId}
        onBack={() => {
          setSelectedAccessCodeId(null)
        }}
        disableLockUnlock={disableLockUnlock}
      />
    )
  }

  if (isAddMode) {
    return <AccessCodeAddForm className={className} onBack={toggleAddMode} />
  }

  return (
    <div className={classNames('seam-access-code-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.accessCodes} <Caption>({filteredAccessCodes.length})</Caption>
        </TableTitle>
        <SearchTextField
          value={searchInputValue}
          onChange={setSearchInputValue}
          disabled={(accessCodes?.length ?? 0) === 0}
        />
      </TableHeader>
      <TableBody>
        <Content
          accessCodes={filteredAccessCodes}
          onAccessCodeClick={handleAccessCodeClick}
        />
      </TableBody>
    </div>
  )
}

function Content(props: {
  accessCodes: Array<UseAccessCodesData[number]>
  onAccessCodeClick: (accessCodeId: string) => void
}): JSX.Element {
  const { accessCodes, onAccessCodeClick } = props
  const [filter, setFilter] = useState<AccessCodeFilter | null>(null)

  const filteredAccessCodes = useFilteredAccessCodes(filter, accessCodes)

  if (filteredAccessCodes.length === 0) {
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
        />
      ))}
    </>
  )
}

function AccessCodeRow(props: {
  accessCode: UseAccessCodesData[number]
  onClick: () => void
}): JSX.Element {
  const { onClick, accessCode } = props

  const errorCount = accessCode.errors.length
  const warningCount = accessCode.warnings.length
  const isPlural = errorCount === 0 || errorCount > 1
  const errorIconTitle = isPlural
    ? `${errorCount} ${t.codeIssues}`
    : `${errorCount} ${t.codeIssue}`
  const warningIconTitle = isPlural
    ? `${warningCount} ${t.codeIssues}`
    : `${warningCount} ${t.codeIssue}`

  return (
    <TableRow onClick={onClick}>
      <TableCell className='seam-icon-cell'>
        <div>
          <AccessCodeKeyIcon />
        </div>
      </TableCell>
      <TableCell className='seam-name-cell'>
        <Title className='seam-truncated-text'>{accessCode.name}</Title>
        <CodeDetails accessCode={accessCode} />
      </TableCell>
      <TableCell className='seam-action-cell'>
        {errorCount > 0 && (
          <div className='seam-code-issue-icon-wrap' title={errorIconTitle}>
            <ExclamationCircleOutlineIcon />
          </div>
        )}
        {errorCount === 0 && warningCount > 0 && (
          <div className='seam-code-issue-icon-wrap' title={warningIconTitle}>
            <TriangleWarningOutlineIcon />
          </div>
        )}
        <MoreActionsMenu
          menuProps={{
            backgroundProps: {
              className: 'seam-access-code-table-action-menu',
            },
          }}
        >
          <MenuItem
            onClick={() => {
              void copyToClipboard(accessCode.code ?? '')
            }}
          >
            <div className='menu-item-copy'>
              <span>
                {t.copyCode} - {accessCode.code}
              </span>
              <CopyIcon />
            </div>
          </MenuItem>
        </MoreActionsMenu>
      </TableCell>
    </TableRow>
  )
}

function useFilteredAccessCodes(
  filter: AccessCodeFilter | null,
  accessCodes: Array<UseAccessCodesData[number]>
) {
  return useMemo(() => {
    if (filter === null) {
      return accessCodes
    }

    if (filter === 'access_code_issues') {
      return accessCodes.filter(hasIssue)
    }

    return accessCodes
  }, [accessCodes, filter])
}

function hasIssue(accessCode: AccessCode) {
  return accessCode.errors.length > 0 || accessCode.warnings.length > 0
}

const t = {
  accessCodes: 'Access Codes',
  copyCode: 'Copy code',
  noAccessCodesMessage: 'Sorry, no access codes were found',
  codeIssue: 'code issue',
  codeIssues: 'code issues',
}
