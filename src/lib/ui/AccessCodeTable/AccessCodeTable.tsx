import type { AccessCode } from 'seamapi'

import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableTitle,
} from 'lib/ui/Table/index.js'

import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { DotsEllipsisMoreIcon } from 'lib/icons/DotsEllipsisMore.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'

export function AccessCodeTable(props: {
  accessCodes: AccessCode[]
  onClickBack?: () => void
}) {
  const { accessCodes, onClickBack } = props

  console.log('on back: ', onClickBack)
  return (
    <div className='seam--access-code-table'>
      <ContentHeader onClickBack={onClickBack} />
      <TableHeader>
        <TableTitle>
          Access Codes <Caption>({accessCodes.length})</Caption>
        </TableTitle>
      </TableHeader>
      <TableBody>
        {accessCodes.map((code) => (
          <TableRow key={code.access_code_id}>
            <TableCell className='seam--icon-cell'>
              <div>
                <AccessCodeKeyIcon />
              </div>
            </TableCell>
            <TableCell className='seam--name-cell'>
              <Title>{code.name}</Title>
            </TableCell>
            <TableCell className='seam--action-cell'>
              <IconButton>
                <DotsEllipsisMoreIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </div>
  )
}
