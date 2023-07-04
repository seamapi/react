import classNames from 'classnames'
import { cloneElement, createContext, useEffect, useState } from 'react'

import { InputLabel } from 'lib/ui/InputLabel.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

interface FormFieldContextProps {
  hasError: boolean
}

const FormFieldContext = createContext<undefined | FormFieldContextProps>(
  undefined
)

interface FormFieldProps {
  children: JSX.Element | JSX.Element[]
  className?: string
  isValid?: (value: string) => boolean
}

export function FormField({ children, className, isValid }: FormFieldProps) {
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null)
  const [value, setValue] = useState<string | undefined>()

  const focusInput = () => {
    if (inputEl != null) {
      inputEl.focus()
    }
  }

  const components = Array.isArray(children) ? children : [children]

  // Map children to automatically focus on input when clicking
  // on an InputLabel.
  const updatedComponents = components.map((component, index) => {
    const baseProps = {
      ...component.props,
      key: index,
    }

    if (component.type === InputLabel) {
      return cloneElement(component, {
        ...baseProps,
        onClick: focusInput,
      })
    }

    if (component.type === TextField) {
      return cloneElement(component, {
        ...baseProps,
        ref: setInputEl,
      })
    }

    return cloneElement(component, baseProps)
  })

  // Bind listeners to inputEl to get current value
  useEffect(() => {
    if (inputEl == null) {
      return
    }

    const handler = (event: Event): void => {
      if (event.target == null || !('value' in event.target)) {
        return
      }

      const inputValue = event.target.value as string
      setValue(inputValue)
    }

    inputEl.addEventListener('input', handler)

    return () => {
      inputEl.removeEventListener('input', handler)
    }
  }, [inputEl, value])

  const hasError =
    isValid != null && value !== undefined && value !== ''
      ? !isValid(value)
      : false

  return (
    <div className={classNames('seam-form-field', className)}>
      <FormFieldContext.Provider value={{ hasError }}>
        {updatedComponents}
      </FormFieldContext.Provider>
    </div>
  )
}
