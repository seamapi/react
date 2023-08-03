import type { ElementProps } from 'lib/element.js'

import type { AccessCodeDetailsProps } from './AccessCodeDetails.js'

export const name = 'seam-access-code-details'

export const props: ElementProps<AccessCodeDetailsProps> = {
  accessCodeId: 'string',
  disableLockUnlock: 'boolean',
  disableDeleteAccessCode: 'boolean',
  onBack: 'object',
  onEdit: 'object',
  className: 'string',
}

export { AccessCodeDetails as Component } from './AccessCodeDetails.js'
