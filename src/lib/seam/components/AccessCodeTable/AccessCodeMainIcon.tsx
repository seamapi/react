import type { AccessCode } from '@seamapi/types/connect'

import { AccessCodeKeyIcon } from 'lib/icons/AccessCodeKey.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import { TriangleWarningOutlineIcon } from 'lib/icons/TriangleWarningOutline.js'

export interface AccessCodeMainIconProps {
  accessCode: AccessCode
}

export function AccessCodeMainIcon({
  accessCode,
}: AccessCodeMainIconProps): JSX.Element {
  const errorCount = accessCode.errors.length
  const warningCount = accessCode.warnings.length
  const isPlural = errorCount === 0 || errorCount > 1
  const errorIconTitle = isPlural
    ? `${errorCount} ${t.codeIssues}`
    : `${errorCount} ${t.codeIssue}`
  const warningIconTitle = isPlural
    ? `${warningCount} ${t.codeIssues}`
    : `${warningCount} ${t.codeIssue}`

  if (errorCount > 0) {
    return (
      <>
        <div
          className='seam-issue-icon-wrap seam-md-invisible'
          title={errorIconTitle}
        >
          <ExclamationCircleOutlineIcon />
        </div>
        <div className='seam-invisible seam-md-flex'>
          <KeyIcon />
        </div>
      </>
    )
  }

  if (errorCount === 0 && warningCount > 0) {
    return (
      <>
        <div
          className='seam-issue-icon-wrap seam-md-invisible'
          title={warningIconTitle}
        >
          <TriangleWarningOutlineIcon />
        </div>
        <div className='seam-invisible seam-md-flex'>
          <KeyIcon />
        </div>
      </>
    )
  }

  return (
    <div className='seam-issue-icon-wrap'>
      <KeyIcon />
    </div>
  )
}

function KeyIcon(): JSX.Element {
  return <AccessCodeKeyIcon style={{ fontSize: '24px' }} />
}

const t = {
  codeIssue: 'code issue',
  codeIssues: 'code issues',
}
