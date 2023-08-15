import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import { TriangleWarningOutlineIcon } from 'lib/icons/TriangleWarningOutline.js'
import type { UseAccessCodesData } from 'lib/seam/access-codes/use-access-codes.js'
import { AccessCodeMenu } from 'lib/seam/components/AccessCodeTable/AccessCodeMenu.js'
import { CodeDetails } from 'lib/seam/components/AccessCodeTable/CodeDetails.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'

export interface AccessCodeRowProps {
  accessCode: UseAccessCodesData[number]
  onClick: () => void
  onEdit: () => void
  disableEditAccessCode: boolean
  disableDeleteAccessCode: boolean
}

export function AccessCodeRow({
  onClick,
  accessCode,
  onEdit,
  disableEditAccessCode,
  disableDeleteAccessCode,
}: AccessCodeRowProps): JSX.Element {
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
          <div className='seam-issue-icon-wrap' title={errorIconTitle}>
            <ExclamationCircleOutlineIcon />
          </div>
        )}
        {errorCount === 0 && warningCount > 0 && (
          <div className='seam-issue-icon-wrap' title={warningIconTitle}>
            <TriangleWarningOutlineIcon />
          </div>
        )}
        <AccessCodeMenu
          accessCode={accessCode}
          onEdit={onEdit}
          onViewDetails={onClick}
          disableDeleteAccessCode={disableDeleteAccessCode}
          disableEditAccessCode={disableEditAccessCode}
        />
      </TableCell>
    </TableRow>
  )
}

const t = {
  codeIssue: 'code issue',
  codeIssues: 'code issues',
}
