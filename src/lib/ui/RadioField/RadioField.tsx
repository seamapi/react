import { createContext, useContext } from 'react'

export interface RadioFieldProps<Value> {
  name: string
  value: Value
  onChange: (value: Value) => void
  children: JSX.Element | JSX.Element[]
}

interface RadioFieldContextProps {
  value: any
  onChange: (value: any) => void
  name: string
}

const RadioFieldContext = createContext<RadioFieldContextProps | undefined>(
  undefined
)

export function RadioField<Value>({
  value,
  onChange,
  children,
  name,
}: RadioFieldProps<Value>): JSX.Element {
  return (
    <RadioFieldContext.Provider
      value={{
        value,
        onChange,
        name,
      }}
    >
      <div className='seam-radio-field'>{children}</div>
    </RadioFieldContext.Provider>
  )
}

export function useRadioField(): RadioFieldContextProps {
  const context = useContext(RadioFieldContext)
  if (context === undefined) {
    throw new Error('useRadioField must be used within a <RadioField/>')
  }
  return context
}
