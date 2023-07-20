import { createContext, useContext } from 'react'

import { Radio } from 'lib/ui/RadioField/Radio.js'

interface RadioFieldProps<Value extends string> {
  name: string
  value: Value
  onChange: (value: Value) => void
  options: Array<RadioOption<Value>>
}

interface RadioOption<Value> {
  label: string
  value: Value
}

type RadioFieldContext<Value extends string> =
  | Omit<RadioFieldProps<Value>, 'options'>
  | undefined

const radioFieldContext = createContext<RadioFieldContext<any>>(undefined)

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

export function useRadioField<Value extends string>(): NonNullable<
  RadioFieldContext<Value>
> {
  const context = useContext<RadioFieldContext<Value>>(radioFieldContext)
  if (context === undefined) {
    throw new Error('useRadioField must be used within a <RadioField/>')
  }
  return context
}
