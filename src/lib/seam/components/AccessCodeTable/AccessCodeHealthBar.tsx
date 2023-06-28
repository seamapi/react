import _ from 'lodash'

import { CheckIcon } from 'lib/icons/Check.js'
import { ExclamationCircleOutlineIcon } from 'lib/icons/ExclamationCircleOutline.js'
import type { UseAccessCodesData } from 'lib/seam/access-codes/use-access-codes.js'
import { TableFilterBar } from 'lib/ui/Table/TableFilterBar/TableFilterBar.js'
import { TableFilterItem } from 'lib/ui/Table/TableFilterBar/TableFilterItem.js'

export type AccessCodeFilter = 'access_code_issues'

interface AccessCodeHealthBarProps {
  accessCodes: Array<UseAccessCodesData[number]>
  filter: AccessCodeFilter | null
  onFilterSelect: (filter: AccessCodeFilter | null) => void
}

export function AccessCodeHealthBar({
  accessCodes,
  filter,
  onFilterSelect,
}: AccessCodeHealthBarProps): JSX.Element {
  const erroredAccessCodes = accessCodes.filter(
    (accessCodes) => accessCodes.errors.length > 0
  )
  const warningAccessCodes = accessCodes.filter(
    (accessCodes) => accessCodes.warnings.length > 0
  )
  const codesWithIssues = _.merge(erroredAccessCodes, warningAccessCodes)
  const issueCount = codesWithIssues.length

  const toggle = (target: AccessCodeFilter) => () => {
    const newFilter = target === filter ? null : target
    onFilterSelect(newFilter)
  }

  const isPlural = issueCount === 0 || issueCount > 1
  const label = isPlural
    ? `${issueCount} ${t.accessCodeIssues}`
    : `${issueCount} ${t.accessCodeIssue}`

  if (issueCount === 0) {
    return (
      <TableFilterBar filterCleared>
        <TableFilterItem>
          <CheckIcon />
          {t.accessCodesOk}
        </TableFilterItem>
      </TableFilterBar>
    )
  }

  return (
    <TableFilterBar
      filterCleared={filter == null}
      onFilterClear={() => {
        onFilterSelect(null)
      }}
    >
      <TableFilterItem
        onClick={toggle('access_code_issues')}
        selected={filter === 'access_code_issues'}
      >
        <ExclamationCircleOutlineIcon />
        {label}
      </TableFilterItem>
    </TableFilterBar>
  )
}

const t = {
  accessCodesOk: 'Access codes OK',
  accessCodeIssue: 'access code issue',
  accessCodeIssues: 'access code issues',
}
