import classNames from 'classnames'

import { SearchIcon } from 'lib/icons/Search.js'
import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

export function SearchTextField({
  className,
  value,
  onChange,
  ...props
}: TextFieldProps): JSX.Element {
  return (
    <TextField
      value={value}
      onChange={onChange}
      {...props}
      className={classNames(className, 'seam-search-text-field')}
      startAdornment={<SearchIcon />}
      inputProps={{
        placeholder: 'Search',
      }}
      clearable
    />
  )
}
