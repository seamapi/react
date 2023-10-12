import type { ElementProps } from 'lib/element.js'
import type { EditAccessCodeFormProps } from 'lib/seam/components/EditAccessCodeForm/EditAccessCodeForm.js'

export const name = 'seam-edit-access-code-form'

export const props: ElementProps<EditAccessCodeFormProps> = {
  accessCodeId: 'string',
  onSuccess: 'object',
}

export { EditAccessCodeForm as Component } from './EditAccessCodeForm.js'
