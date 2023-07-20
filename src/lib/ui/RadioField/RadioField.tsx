import { createContext, useContext } from 'react'

import { Radio } from 'lib/ui/RadioField/Radio.js'

export interface RadioFieldProps<Value extends string> {
  name: string
  value: Value
  onChange: (value: Value) => void
  options: Array<RadioOption<Value>>
}

export interface RadioOption<Value> {
  label: string
  value: Value
}

interface RadioFieldContextProps<Value extends string> {
  value: Value
  onChange: (value: Value) => void
  name: string
}

const radioFieldContext = createContext<
  RadioFieldContextProps<any> | undefined
>(undefined)

export function RadioField<Value extends string>({
  value,
  onChange,
  name,
  options,
}: RadioFieldProps<Value>): JSX.Element {
  const { Provider } = radioFieldContext
  return (
    <Provider
      value={{
        value,
        onChange,
        name,
      }}
    >
      <div className='seam-radio-field'>
        {options.map(({ value, label }, index) => (
          <Radio value={value} label={label} key={index} />
        ))}
      </div>
    </Provider>
  )
}

export function useRadioField<
  Value extends string,
>(): RadioFieldContextProps<Value> {
  const context = useContext(radioFieldContext)
  if (context === undefined) {
    throw new Error('useRadioField must be used within a <RadioField/>')
  }
  return context
}
