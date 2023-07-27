import type { ElementProps } from 'lib/element.js'
import type { AccessCodeFormProps } from 'lib/seam/components/AccessCodeForm/AccessCodeForm.js'

export const name = 'seam-access-code-form'

export const props: ElementProps<AccessCodeFormProps> = {
  className: 'string',
  onBack: 'object',
  accessCode: 'object',
  device: 'object',
  isSubmitting: 'boolean',
  onSubmit: 'object',
}

export { AccessCodeForm as Component } from './AccessCodeForm.js'
