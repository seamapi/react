import type { ElementProps } from 'lib/element.js'

import type { AccessCodeTableProps } from './AccessCodeTable.js'

export const name = 'seam-access-code-table'

export const props: ElementProps<AccessCodeTableProps> = {
  deviceId: 'string',
  disableLockUnlock: 'boolean',
  disableSearch: 'boolean',
  accessCodeFilter: 'function',
  accessCodeComparator: 'function',
  onAccessCodeClick: 'function',
  preventDefaultOnAccessCodeClick: 'boolean',
  onBack: 'function',
  className: 'string',
}

export { AccessCodeTable as Component } from './AccessCodeTable.js'
