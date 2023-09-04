import type { ElementProps } from 'lib/element.js'

import type { AccessCodeTableProps } from './AccessCodeTable.js'

export const name = 'seam-access-code-table'

export const props: ElementProps<Omit<AccessCodeTableProps, 'title'>> = {
  deviceId: 'string',
  disableLockUnlock: 'boolean',
  disableCreateAccessCode: 'boolean',
  disableEditAccessCode: 'boolean',
  disableDeleteAccessCode: 'boolean',
  disableSearch: 'boolean',
  accessCodeFilter: 'object',
  accessCodeComparator: 'object',
  onAccessCodeClick: 'object',
  preventDefaultOnAccessCodeClick: 'boolean',
  onBack: 'object',
  heading: 'string',
  className: 'string',
}

export { AccessCodeTable as Component } from './AccessCodeTable.js'
