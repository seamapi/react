import { type MouseEventHandler, useEffect, useState } from 'react'

import { InfoIcon } from 'lib/icons/Info.js'
import { InfoDarkIcon } from 'lib/icons/InfoDark.js'

interface TooltipProps {
  children: React.ReactNode
}

export function Tooltip({ children }: TooltipProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = (): void => {
    setIsOpen(false)
  }

  const handleEscape = (ev: KeyboardEvent): void => {
    if (ev.key === 'Escape') {
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
          <div className='seam-tooltip-button-icon seam-tooltip-button-icon-default'>
            <InfoIcon />
          </div>
          <div className='seam-tooltip-button-icon seam-tooltip-button-icon-hover'>
            <InfoDarkIcon />
          </div>
        </button>
      </div>

      <div
        className='seam-tooltip-popover'
        aria-expanded={isOpen}
        onClick={(ev) => ev.stopPropagation()}
      >
        <p className='seam-tooltip-text'>{children}</p>
      </div>
    </div>
  )
}
