import type { ElementProps } from 'lib/element.js'
import type { CreateAccessCodeFormProps } from 'lib/seam/components/CreateAccessCodeForm/CreateAccessCodeForm.js'

export const name = 'seam-create-access-code-form'

export const props: ElementProps<CreateAccessCodeFormProps> = {
  deviceId: 'string',
  onSuccess: 'object',
}

export { CreateAccessCodeForm as Component } from './CreateAccessCodeForm.js'
