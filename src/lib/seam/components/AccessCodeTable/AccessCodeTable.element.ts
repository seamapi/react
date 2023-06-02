import type { ElementProps } from 'lib/element.js'

import type { AccessCodeTableProps } from './AccessCodeTable.js'

export const name = 'seam-access-code-table'

export const props: ElementProps<AccessCodeTableProps> = {
  deviceId: 'string',
  onBack: 'function',
}

export { AccessCodeTable as Component } from './AccessCodeTable.js'
