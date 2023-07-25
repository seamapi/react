import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { AddIcon } from 'lib/icons/Add.js'
import { CopyIcon } from 'lib/icons/Copy.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import { TriangleWarningOutlineIcon } from 'lib/icons/TriangleWarningOutline.js'
import {
  useAccessCodes,
  type UseAccessCodesData,
} from 'lib/seam/access-codes/use-access-codes.js'
import { AccessCodeDetails } from 'lib/seam/components/AccessCodeDetails/AccessCodeDetails.js'
import { AccessCodeForm } from 'lib/seam/components/AccessCodeForm/AccessCodeForm.js'
import {
  type AccessCodeFilter,
  AccessCodeHealthBar,
} from 'lib/seam/components/AccessCodeTable/AccessCodeHealthBar.js'
import { CodeDetails } from 'lib/seam/components/AccessCodeTable/CodeDetails.js'
import { copyToClipboard } from 'lib/ui/clipboard.js'
import { IconButton } from 'lib/ui/IconButton.js'
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

const disableCreateAccessCode = true

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

  const [selectedAccessCodeId, setSelectedAccessCodeId] = useState<
    string | null
  >(null)

  const [searchInputValue, setSearchInputValue] = useState('')
  const [accessCodeFormVisible, toggleAddAccessCodeForm] = useToggle()

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

  if (accessCodeFormVisible) {
    return (
      <AccessCodeForm
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

const t = {
  accessCodes: 'Access Codes',
  copyCode: 'Copy code',
  noAccessCodesMessage: 'Sorry, no access codes were found',
  codeIssue: 'code issue',
  codeIssues: 'code issues',
}
