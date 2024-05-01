import type { PropsWithChildren } from 'react'

import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'
import classNames from 'classnames'

interface DetailSectionProps {
  label?: string
  tooltipContent?: string
  className?: string
}

export function DetailSection({
  label,
  tooltipContent,
  className,
  children,
}: PropsWithChildren<DetailSectionProps>): JSX.Element {
  return (
    <div className={classNames('seam-detail-section', className)}>
      <div className='seam-detail-label-wrap'>
        {label != null && <p className='seam-detail-label'>{label}</p>}
        {tooltipContent != null && <Tooltip>{tooltipContent}</Tooltip>}
      </div>

      <div className='seam-detail-group'>{children}</div>
    </div>
  )
}
