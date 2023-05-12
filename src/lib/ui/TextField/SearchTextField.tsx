import classNames from 'classnames'

import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

export function SearchTextField({
  className,
  ...otherProps
}: TextFieldProps): JSX.Element {
  return (
    <TextField
      {...otherProps}
      className={classNames(className, 'seam-search-text-field')}
    />
  )
}
