import type { ElementProps } from 'lib/element.js'
import type { AccessCodeFormProps } from 'lib/seam/components/AccessCodeForm/AccessCodeForm.js'

export const name = 'seam-access-code-form'

export const props: ElementProps<AccessCodeFormProps> = {
  deviceId: 'string',
  onBack: 'object',
  className: 'string',
}

export { AccessCodeForm as Component } from './AccessCodeForm.js'
