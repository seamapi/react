import type { ElementProps } from 'lib/element.js'
import type { CreateAccessCodeFormProps } from 'lib/seam/components/CreateAccessCodeForm/CreateAccessCodeForm.js'

export const name = 'seam-create-access-code-form'

export const props: ElementProps<CreateAccessCodeFormProps> = {
  className: 'string',
  onBack: 'object',
  deviceId: 'string',
}

export { CreateAccessCodeForm as Component } from './CreateAccessCodeForm.js'
