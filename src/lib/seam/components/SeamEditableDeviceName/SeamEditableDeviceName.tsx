/* eslint-disable import/no-duplicates */

import classNames from 'classnames'
import type React from 'react'
import { type KeyboardEvent, useCallback, useState } from 'react'

import { CheckIcon } from 'lib/icons/Check.js'
import { CloseIcon } from 'lib/icons/Close.js'
import { EditIcon } from 'lib/icons/Edit.js'

export type SeamDeviceNameProps = {
  onEdit?: (newName: string) => void
  editable?: boolean
  tagName?: string
  value: string
} & React.HTMLAttributes<HTMLElement>

function IconButton(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
): JSX.Element {
  return (
    <button
      {...props}
      className={classNames(
        'seam-editable-device-name-icon-button',
        props.className
      )}
    >
      {props.children}
    </button>
  )
}

function fixName(name: string): string {
  return name.replace(/\s+/g, ' ').trim()
}

function isValidName(
  name: string
): { type: 'success' } | { type: 'error'; message: string } {
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

export function SeamEditableDeviceName({
  onEdit,
  editable = true,
  tagName,
  value,
  ...props
}: SeamDeviceNameProps): JSX.Element {
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
    (event: React.ChangeEvent<HTMLInputElement>): void => {
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
      {editing ? (
        <span className='seam-editable-device-name-input-wrapper'>
          <input
            type='text'
            defaultValue={value}
            onChange={handleChange}
            onKeyDown={handleInputKeydown}
            ref={(el) => {
              setTimeout(() => {
                el?.focus()
              }, 0)
            }}
          />

          {errorText != null && (
            <span className='seam-editable-device-name-input-error'>
              {errorText}
            </span>
          )}
        </span>
      ) : (
        <span>{value}</span>
      )}

      <span className='seam-editable-device-name-icon-wrapper'>
        {editable ? (
          editing ? (
            <>
              <IconButton onClick={handleCheck}>
                <CheckIcon width='1em' height='1em' viewBox='0 0 24 24' />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CloseIcon width='1em' height='1em' viewBox='0 0 24 24' />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={() => {
                setEditing(true)
              }}
            >
              <EditIcon width='1em' height='1em' viewBox='0 0 24 24' />
            </IconButton>
          )
        ) : null}
      </span>
    </Tag>
  )
}
