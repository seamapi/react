import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { useAccessCodes } from 'lib/seam/access-codes/use-access-codes.js'
import { AccessCodeDetails } from 'lib/ui/AccessCodeDetails/AccessCodeDetails.js'
import { CodeDetails } from 'lib/ui/AccessCodeTable/CodeDetails.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'

export function AccessCodeTable(props: {
  deviceId: string
  onBack?: () => void
}): JSX.Element {
  const { accessCodes } = useAccessCodes({
    device_id: props.deviceId,
  })
  const { onBack } = props

  const [selectedAccessCode, selectAccessCode] = useState<AccessCode | null>(
    null
  )

  if (selectedAccessCode) {
    return (
      <AccessCodeDetails
        accessCode={selectedAccessCode}
        onBack={() => {
          selectAccessCode(null)
        }}
      />
    )
  }

  if (!accessCodes) return <>{null}</>

  return (
    <div className='seam-access-code-table'>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.accessCodes} <Caption>({accessCodes.length})</Caption>
        </TableTitle>
      </TableHeader>
      <TableBody>
        {accessCodes.map((code) => (
          <TableRow
            key={code.access_code_id}
            onClick={() => {
              selectAccessCode(code)
            }}
          >
            <TableCell className='seam-icon-cell'>
              <div>
                <AccessCodeKeyIcon />
              </div>
            </TableCell>
            <TableCell className='seam-name-cell'>
              <Title>{code.name}</Title>
              <CodeDetails accessCode={code} />
            </TableCell>
            <TableCell className='seam-action-cell'>
              {/* <IconButton>
                <DotsEllipsisMoreIcon />
              </IconButton> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </div>
  )
}

const t = {
  accessCodes: 'Access Codes',
}
