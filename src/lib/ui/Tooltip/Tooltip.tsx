import {
  type MouseEventHandler,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react'

import { InfoIcon } from 'lib/icons/Info.js'
import { InfoDarkIcon } from 'lib/icons/InfoDark.js'

export function Tooltip({ children }: PropsWithChildren): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClose = (): void => {
      setIsOpen(false)
    }

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }
    if (isOpen) {
      globalThis.document?.addEventListener('click', handleClose)
      globalThis.addEventListener?.('keydown', handleEscape)
    }

    return () => {
      globalThis.document?.removeEventListener('click', handleClose)
      globalThis.removeEventListener?.('keydown', handleEscape)
    }
  }, [isOpen, setIsOpen])

  const handleToggle: MouseEventHandler<HTMLButtonElement> = (event): void => {
    event.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  return (
    <div className='seam-tooltip'>
      <div className='seam-tooltip-trigger-wrap'>
        <button type='button' onClick={handleToggle} className='seam-tooltip-button'>
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
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <p className='seam-tooltip-text'>{children}</p>
      </div>
    </div>
  )
}
