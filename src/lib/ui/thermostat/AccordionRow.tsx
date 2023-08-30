import { type PropsWithChildren, useState } from 'react'

import { ChevronWideIcon } from 'lib/icons/ChevronWide.js'

interface AccordionRowProps extends PropsWithChildren {
  label: string
  rightCollapsedContent?: JSX.Element
}

export function AccordionRow({
  label,
  rightCollapsedContent,
  children,
}: AccordionRowProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = (): void => {
    setIsExpanded((isExpanded) => !isExpanded)
  }

  return (
    <div className='seam-thermostat-accordion-row' aria-expanded={isExpanded}>
      <button
        className='seam-thermostat-accordion-row-trigger'
        onClick={toggleExpanded}
      >
        <p className='seam-thermostat-row-label'>{label}</p>
        <div className='seam-thermostat-row-inner-wrap'>
          <div className='seam-thermostat-row-trigger-right-content'>
            {rightCollapsedContent}
          </div>
          <div className='seam-thermostat-accordion-icon-wrap'>
            <ChevronWideIcon />
          </div>
        </div>
      </button>
      <div className='seam-thermostat-accordion-row-content'>
        <div className='seam-thermostat-accordion-row-inner-content'>
          {children}
        </div>
      </div>
    </div>
  )
}
