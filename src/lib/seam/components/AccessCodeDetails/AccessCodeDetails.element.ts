import type { ElementProps } from 'lib/element.js'

import type { AccessCodeDetailsProps } from './AccessCodeDetails.js'

export const name = 'seam-access-code-details'

export const props: ElementProps<AccessCodeDetailsProps> = {
  accessCodeId: 'string',
  onEdit: 'object',
  preventDefaultOnEdit: 'boolean',
  onDelete: 'object',
  preventDefaultOnDelete: 'boolean',
}

export { AccessCodeDetails as Component } from './AccessCodeDetails.js'
