import type { ButtonProps } from 'lib/ui/types.js'

export function TextButton(props: ButtonProps): JSX.Element {
  return <button {...props} className='seam-text-btn' />
}
