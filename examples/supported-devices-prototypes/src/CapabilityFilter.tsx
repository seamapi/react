import { useEffect, useId, useRef, useState } from 'react'

import { getCapabilityLabel } from 'lib/seam/components/SupportedDevices/device-models.js'

export function CapabilityFilter({
  capabilities,
  selected,
  onChange,
}: {
  capabilities: string[]
  selected: string[]
  onChange: (capabilities: string[]) => void
}): JSX.Element {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const summary =
    selected.length === 0
      ? 'All capabilities'
      : selected.length === 1
        ? getCapabilityLabel(selected[0] ?? '')
        : `${selected.length} selected`

  useEffect(() => {
    if (!open) return
    root.current?.querySelector<HTMLInputElement>('input')?.focus()
    const onPointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        root.current?.contains(event.target) !== true
      )
        setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div
      ref={root}
      className='seam-proto-capability-filter'
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (open) event.stopPropagation()
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          setOpen(false)
          trigger.current?.focus()
        } else if (
          event.key === 'ArrowDown' &&
          event.target === trigger.current
        ) {
          event.preventDefault()
          event.stopPropagation()
          setOpen(true)
          root.current?.querySelector<HTMLInputElement>('input')?.focus()
        }
      }}
    >
      <span id={`${id}-label`}>Capabilities</span>
      <button
        ref={trigger}
        type='button'
        className='seam-proto-capability-trigger'
        aria-labelledby={`${id}-label ${id}-selection`}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        title={selected.map(getCapabilityLabel).join(', ')}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <span id={`${id}-selection`}>{summary}</span>
        <svg
          aria-hidden
          className='seam-proto-filter-chevron'
          width='14'
          height='14'
          viewBox='0 0 20 20'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
        >
          <path d='m5 8 5 5 5-5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>
      {open && (
        <div id={`${id}-options`} className='seam-proto-capability-options'>
          <p>Show devices supporting every selected capability.</p>
          <fieldset>
            <legend className='seam-compact-sr-only'>
              Required capabilities
            </legend>
            {capabilities.map((name) => (
              <label className='seam-proto-capability-option' key={name}>
                <input
                  type='checkbox'
                  value={name}
                  checked={selected.includes(name)}
                  onChange={(event) => {
                    onChange(
                      event.target.checked
                        ? [...selected, name]
                        : selected.filter((item) => item !== name)
                    )
                  }}
                />
                <span>{getCapabilityLabel(name)}</span>
              </label>
            ))}
          </fieldset>
          <button
            type='button'
            className='seam-proto-capability-clear'
            disabled={selected.length === 0}
            onClick={() => {
              onChange([])
              setOpen(false)
              trigger.current?.focus()
            }}
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  )
}
