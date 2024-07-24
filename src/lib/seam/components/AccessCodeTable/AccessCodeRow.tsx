import type { AccessCode } from '@seamapi/types/connect'

import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import { TriangleWarningOutlineIcon } from 'lib/icons/TriangleWarningOutline.js'
import { AccessCodeMainIcon } from 'lib/seam/components/AccessCodeTable/AccessCodeMainIcon.js'
import { AccessCodeMenu } from 'lib/seam/components/AccessCodeTable/AccessCodeMenu.js'
import { CodeDetails } from 'lib/seam/components/AccessCodeTable/CodeDetails.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'

export interface AccessCodeRowProps {
  accessCode: AccessCode
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  disableEditAccessCode: boolean
  disableDeleteAccessCode: boolean
}

export function AccessCodeRow({
  onClick,
  accessCode,
  onEdit,
  onDelete,
  disableEditAccessCode,
  disableDeleteAccessCode,
}: AccessCodeRowProps): JSX.Element {
  const isAccessCodeBeingRemoved = accessCode.status === 'removing'

  const errorCount = accessCode.errors.length
  const warningCount =
    accessCode.warnings.length + (isAccessCodeBeingRemoved ? 1 : 0)
  const errorIconTitle =
    errorCount === 0 || errorCount > 1
      ? `${errorCount} ${t.codeIssues}`
      : `${errorCount} ${t.codeIssue}`
  const warningIconTitle =
    warningCount === 0 || warningCount > 1
      ? `${warningCount} ${t.codeIssues}`
      : `${warningCount} ${t.codeIssue}`

  return (
    <TableRow onClick={onClick}>
      <TableCell
        className='seam-icon-cell'
        style={{
          opacity: isAccessCodeBeingRemoved ? 0.4 : 1,
        }}
      >
        <AccessCodeMainIcon accessCode={accessCode} />
      </TableCell>
      <TableCell
        className='seam-name-cell'
        style={{
          opacity: isAccessCodeBeingRemoved ? 0.4 : 1,
        }}
      >
        <Title className='seam-truncated-text'>{accessCode.name}</Title>
        <CodeDetails accessCode={accessCode} />
      </TableCell>
      <TableCell className='seam-action-cell'>
        {errorCount > 0 && (
          <div
            className='seam-issue-icon-wrap seam-invisible seam-md-flex'
            title={errorIconTitle}
          >
            <ExclamationCircleOutlineIcon />
          </div>
        )}
        {errorCount === 0 && warningCount > 0 && (
          <div
            className='seam-issue-icon-wrap seam-invisible seam-md-flex'
            title={warningIconTitle}
          >
            <TriangleWarningOutlineIcon />
          </div>
        )}
        <AccessCodeMenu
          accessCode={accessCode}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onClick}
          disableDeleteAccessCode={
            isAccessCodeBeingRemoved || disableDeleteAccessCode
          }
          disableEditAccessCode={
            isAccessCodeBeingRemoved || disableEditAccessCode
          }
        />
      </TableCell>
    </TableRow>
  )
}

const t = {
  codeIssue: 'code issue',
  codeIssues: 'code issues',
}
