import classNames from 'classnames'
import {
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react'

import { CheckIcon } from 'lib/icons/Check.js'
import { CloseIcon } from 'lib/icons/Close.js'
import { EditIcon } from 'lib/icons/Edit.js'

type EditableDeviceNameProps = {
  onEdit?: (newName: string) => void
  editable?: boolean
  tagName?: string
  value: string
} & HTMLAttributes<HTMLElement>

export function EditableDeviceName({
  onEdit,
  editable = true,
  tagName,
  value,
  ...props
}: EditableDeviceNameProps): JSX.Element {
  const [editing, setEditing] = useState(false)
  const [errorText, setErrorText] = useState<null | string>(null)
  const [currentValue, setCurrentValue] = useState(value)
  const Tag = (tagName ?? 'span') as 'div'

  const handleCheck = useCallback(() => {
    const fixedName = fixName(currentValue)
    const valid = isValidName(fixedName)

    if (valid.type === 'error') {
      setErrorText(valid.message)
      return
    }

    setEditing(false)
    setCurrentValue(fixedName)
    onEdit?.(fixedName)
  }, [currentValue, onEdit])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setCurrentValue(event.target.value)
      setErrorText(null)
    },
    []
  )

  const handleCancel = useCallback(() => {
    setEditing(false)
    setCurrentValue(value)
    setErrorText(null)
  }, [value])

  const handleInputKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>): void => {
      if (e.repeat) return

      if (e.key === 'Enter') {
        handleCheck()
      } else if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleCheck, handleCancel]
  )

  return (
    <Tag
      {...props}
      className={classNames('seam-editable-device-name', props.className)}
    >
      <NameView
        editing={editing}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleInputKeydown}
        errorText={errorText}
      />

      {editable && (
        <span className='seam-editable-device-name-icon-wrapper'>
          <ActionButtons
            editing={editing}
            onEdit={() => {
              setEditing(true)
            }}
            onCancel={handleCancel}
            onCheck={handleCheck}
          />
        </span>
      )}
    </Tag>
  )
}

interface NameViewProps {
  editing: boolean
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  errorText?: string | null
}

function NameView(props: NameViewProps): JSX.Element {
  if (!props.editing) {
    return <span>{props.value}</span>
  }

  return (
    <span className='seam-editable-device-name-input-wrapper'>
      <input
        type='text'
        defaultValue={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        ref={(el) => {
          setTimeout(() => {
            el?.focus()
          }, 0)
        }}
      />

      {props.errorText != null && (
        <span className='seam-editable-device-name-input-error'>
          {props.errorText}
        </span>
      )}
    </span>
  )
}

interface ActionButtonsProps {
  onEdit: () => void
  onCancel: () => void
  onCheck: () => void
  editing: boolean
}

function ActionButtons(props: ActionButtonsProps): JSX.Element {
  if (props.editing) {
    return (
      <>
        <IconButton onClick={props.onCheck}>
          <CheckIcon width='1em' height='1em' viewBox='0 0 24 24' />
        </IconButton>
        <IconButton onClick={props.onCancel}>
          <CloseIcon width='1em' height='1em' viewBox='0 0 24 24' />
        </IconButton>
      </>
    )
  }

  return (
    <IconButton onClick={props.onEdit}>
      <EditIcon width='1em' height='1em' viewBox='0 0 24 24' />
    </IconButton>
  )
}

function IconButton(
  props: PropsWithChildren<HTMLAttributes<HTMLButtonElement>>
): JSX.Element {
  return (
    <button
      {...props}
      type='button'
      className={classNames(
        'seam-editable-device-name-icon-button',
        props.className
      )}
    >
      {props.children}
    </button>
  )
}

const fixName = (name: string): string => {
  return name.replace(/\s+/g, ' ').trim()
}

type Result =
  | { type: 'success' }
  | {
      type: 'error'
      message: string
    }

const isValidName = (name: string): Result => {
  if (name.length < 2) {
    return {
      type: 'error',
      message: 'Name must be at least 2 characters long',
    }
  }

  if (name.length > 64) {
    return {
      type: 'error',
      message: 'Name must be at most 64 characters long',
    }
  }

  return {
    type: 'success',
  } as const
}
