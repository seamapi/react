import type { AccessCode } from 'seamapi'

import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { CodeDetails } from 'lib/ui/AccessCodeTable/CodeDetails.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'

export interface AccessCodeTableContentProps {
  accessCodes: AccessCode[]
}

export function AccessCodeTableContent(
  props: AccessCodeTableContentProps
): JSX.Element {
  const { accessCodes } = props

  return (
    <div className='seam-access-code-table'>
      <ContentHeader />
      <TableHeader>
        <TableTitle>
          {t.accessCodes} <Caption>({accessCodes.length})</Caption>
        </TableTitle>
      </TableHeader>
      <TableBody>
        {accessCodes.map((code) => (
          <TableRow key={code.access_code_id}>
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
