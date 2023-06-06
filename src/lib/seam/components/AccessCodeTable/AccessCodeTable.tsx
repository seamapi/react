import classNames from 'classnames'
import { useState } from 'react'

import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { CopyIcon } from 'lib/icons/Copy.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import {
  useAccessCodes,
  type UseAccessCodesData,
} from 'lib/seam/access-codes/use-access-codes.js'
import { AccessCodeDetails } from 'lib/seam/components/AccessCodeDetails/AccessCodeDetails.js'
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

export interface AccessCodeTableProps {
  deviceId: string
  onAccessCodeClick?: (accessCodeId: string) => void
  onBack?: () => void
  className?: string
}

export function AccessCodeTable({
  deviceId,
  onAccessCodeClick,
  onBack,
  className,
}: AccessCodeTableProps): JSX.Element | null {
  const { accessCodes } = useAccessCodes({
    device_id: deviceId,
  })

  const [selectedAccessCodeId, setSelectedAccessCodeId] = useState<
    string | null
  >(null)

  const [searchTerm, setSearchTerm] = useState('')

  if (selectedAccessCodeId != null) {
    return (
      <AccessCodeDetails
        className={className}
        accessCodeId={selectedAccessCodeId}
        onBack={() => {
          setSelectedAccessCodeId(null)
        }}
      />
    )
  }

  if (accessCodes == null) {
    return null
  }

  const filteredCodes = accessCodes.filter((accessCode) => {
    if (searchTerm === '') {
      return true
    }

    return new RegExp(searchTerm, 'i').test(accessCode.name ?? '')
  })

  const accessCodeCount = accessCodes.length

  return (
    <div className={classNames('seam-access-code-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.accessCodes} <Caption>({accessCodeCount})</Caption>
        </TableTitle>
        <SearchTextField
          value={searchTerm}
          onChange={setSearchTerm}
          disabled={accessCodeCount === 0}
        />
      </TableHeader>
      <TableBody>
        <Body
          accessCodes={filteredCodes}
          onAccessCodeClick={onAccessCodeClick ?? setSelectedAccessCodeId}
        />
      </TableBody>
    </div>
  )
}

function Body(props: {
  accessCodes: Array<UseAccessCodesData[number]>
  onAccessCodeClick: (accessCodeId: string) => void
}): JSX.Element {
  const { accessCodes, onAccessCodeClick } = props

  if (accessCodes.length === 0) {
    return <EmptyPlaceholder>{t.noAccessCodesMessage}</EmptyPlaceholder>
  }

  return (
    <>
      {accessCodes.map((accessCode) => (
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

  const errorCount = accessCode.errors?.length ?? 0
  const isPlural = errorCount === 0 || errorCount > 1
  const issueIconTitle = isPlural
    ? `${errorCount} ${t.codeIssues}`
    : `${errorCount} ${t.codeIssue}`

  return (
    <TableRow key={accessCode.access_code_id} onClick={onClick}>
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
          <div className='seam-code-issue-icon-wrap' title={issueIconTitle}>
            <ExclamationCircleOutlineIcon />
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
