import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import { copy } from 'lib/copy.js'
import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { CopyIcon } from 'lib/icons/Copy.js'
import {
  useAccessCodes,
  type UseAccessCodesData,
} from 'lib/seam/access-codes/use-access-codes.js'
import { AccessCodeDetails } from 'lib/ui/AccessCodeDetails/AccessCodeDetails.js'
import { CodeDetails } from 'lib/ui/AccessCodeTable/CodeDetails.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'
import { MoreActionsMenu } from 'lib/ui/Menu/MoreActionsMenu.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'

export interface AccessCodeTableProps {
  deviceId: string
  onBack?: () => void
}

export function AccessCodeTable(
  props: AccessCodeTableProps
): JSX.Element | null {
  const { accessCodes } = useAccessCodes({
    device_id: props.deviceId,
  })
  const { onBack } = props

  const [selectedAccessCode, selectAccessCode] = useState<AccessCode | null>(
    null
  )

  if (selectedAccessCode != null) {
    return (
      <AccessCodeDetails
        accessCodeId={selectedAccessCode.access_code_id}
        onBack={() => {
          selectAccessCode(null)
        }}
      />
    )
  }

  if (accessCodes == null) {
    return null
  }

  return (
    <div className='seam-access-code-table'>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.accessCodes} <Caption>({accessCodes.length})</Caption>
        </TableTitle>
      </TableHeader>
      <TableBody>
        <Body accessCodes={accessCodes} selectAccessCode={selectAccessCode} />
      </TableBody>
    </div>
  )
}

function Body(props: {
  accessCodes: Array<UseAccessCodesData[number]>
  selectAccessCode: (accessCode: AccessCode) => void
}) {
  const { accessCodes, selectAccessCode } = props

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
            selectAccessCode(accessCode)
          }}
        />
      ))}
    </>
  )
}

function AccessCodeRow(props: {
  accessCode: UseAccessCodesData[number]
  onClick: () => void
}) {
  const { onClick, accessCode } = props
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
        <MoreActionsMenu
          MenuProps={{
            BackgroundProps: {
              className: 'seam-access-code-table-action-menu',
            },
          }}
        >
          <MenuItem
            onClick={() => {
              void copy(accessCode.code ?? '')
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
}
