import type { PropsWithChildren } from 'react'

import { ChevronWideIcon } from 'lib/icons/ChevronWide.js'
import { useToggle } from 'lib/ui/use-toggle.js'

interface AccordionRowProps extends PropsWithChildren {
  label: string
  leftContent?: JSX.Element
  rightCollapsedContent?: JSX.Element
}

export function AccordionRow({
  label,
  leftContent,
  rightCollapsedContent,
  children,
}: AccordionRowProps): JSX.Element {
  const [isExpanded, toggle] = useToggle()

  return (
    <div className='seam-accordion-row' aria-expanded={isExpanded}>
      <button
        type='button'
        className='seam-accordion-row-trigger'
        onClick={toggle}
      >
        <div className='seam-row-inner-wrap'>
          <p className='seam-row-label'>{label}</p>
          <div className='seam-row-trigger-left-content'>{leftContent}</div>
        </div>
        <div className='seam-row-inner-wrap'>
          <div className='seam-row-trigger-right-content'>
            {rightCollapsedContent}
          </div>
          <div className='seam-accordion-icon-wrap'>
            <ChevronWideIcon />
          </div>
        </div>
      </button>
      <div className='seam-accordion-row-content'>
        <div className='seam-accordion-row-inner-content'>{children}</div>
      </div>
    </div>
  )
}
