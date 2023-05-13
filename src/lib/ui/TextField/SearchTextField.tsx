import classNames from 'classnames'

import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

export function SearchTextField({
  className,
  ...props
}: TextFieldProps): JSX.Element {
  return (
    <TextField
      {...props}
      className={classNames(className, 'seam-search-text-field')}
    />
  )
}
