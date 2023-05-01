import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableTitle,
} from 'lib/ui/Table/index.js'
import { SearchTextField } from 'lib/ui/TextField/index.js'

import { accessCodeKey } from 'lib/icons/access-code-key.js'
import { dotsEllipsis } from 'lib/icons/dots-ellipsis.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { SvgImage } from 'lib/ui/SVGimage.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'

export function AccessCodeTable(props: { accessCodes: AccessCode[] }) {
  const { accessCodes } = props
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='access-code-table'>
      <TableHeader>
        <TableTitle>
          Access Codes <Caption>(29)</Caption>
        </TableTitle>
        <SearchTextField
          placeholder='search codes'
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </TableHeader>
      <TableBody>
        {accessCodes.map((code) => (
          <TableRow key={code.access_code_id}>
            <TableCell className='icon-cell'>
              <div>
                <SvgImage src={accessCodeKey} alt='key' />
              </div>
            </TableCell>
            <TableCell className='name-cell'>
              <Title>{code.name}</Title>
            </TableCell>
            <TableCell className='action-cell'>
              <IconButton>
                <SvgImage src={dotsEllipsis} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </div>
  )
}
