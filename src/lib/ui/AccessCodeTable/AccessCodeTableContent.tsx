import type { AccessCode } from 'seamapi'

import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableTitle,
} from 'lib/ui/Table/index.js'

import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { CodeDetails } from 'lib/ui/AccessCodeTable/CodeDetails.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'

export interface AccessCodeTableContentProps {
  accessCodes: AccessCode[]
  onClickBack?: () => void
}

export function AccessCodeTableContent(
  props: AccessCodeTableContentProps
): JSX.Element {
  const { accessCodes, onClickBack } = props

  return (
    <div className='seam-access-code-table'>
      <ContentHeader onClickBack={onClickBack} />
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
