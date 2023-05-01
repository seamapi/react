import classNames from 'classnames'

import { TextField, type TextFieldProps } from 'lib/ui/TextField/index.js'

export function SearchTextField({ className, ...otherProps }: TextFieldProps) {
  return (
    <TextField
      {...otherProps}
      className={classNames(className, 'seam--search-text-field')}
    />
  )
}
