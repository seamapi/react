import classNames from 'classnames'
import { cloneElement, useRef } from 'react'

import { InputLabel } from 'lib/ui/InputLabel.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

interface FormFieldProps {
  children: JSX.Element | JSX.Element[]
  className?: string
}

export function FormField({
  children,
  className,
}: FormFieldProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>()

  const focusInput = (): void => {
    if (inputRef.current != null) {
      inputRef.current.focus()
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
        ref: inputRef,
      })
    }

    return cloneElement(component, baseProps)
  })

  return (
    <div className={classNames('seam-form-field', className)}>
      {updatedComponents}
    </div>
  )
}
