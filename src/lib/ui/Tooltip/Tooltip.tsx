import { type MouseEventHandler, useEffect, useState } from 'react'

import { InfoIcon } from 'lib/icons/Info.js'

interface TooltipProps {
  children: React.ReactNode
}

export function Tooltip({ children }: TooltipProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = (): void => {
    setIsOpen(false)
  }

  const handleEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleClose)

      return () => {
        window.removeEventListener('keydown', handleEscape)
        document.removeEventListener('click', handleClose)
      }
    }
  }, [isOpen])

  const handleToggle: MouseEventHandler<HTMLButtonElement> = (ev): void => {
    ev.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  return (
    <div className='seam-tooltip'>
      <div className='seam-tooltip-trigger-wrap'>
        <button onClick={handleToggle} className='seam-tooltip-button'>
          <InfoIcon />
        </button>
      </div>

      <div
        className='seam-tooltip-popover'
        aria-expanded={isOpen}
        onClick={(ev) => {
          ev.stopPropagation()
        }}
      >
        <p className='seam-tooltip-text'>{children}</p>
      </div>
    </div>
  )
}
