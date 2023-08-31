import type { PropsWithChildren } from 'react'

import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'

interface DetailSectionProps {
  label?: string
  tooltipContent?: string
}

export function DetailSection({
  label,
  tooltipContent,
  children,
}: PropsWithChildren<DetailSectionProps>): JSX.Element {
  return (
    <div className='seam-detail-section'>
      <div className='seam-detail-label-wrap'>
        {label != null && <p className='seam-detail-label'>{label}</p>}
        {tooltipContent != null && <Tooltip>{tooltipContent}</Tooltip>}
      </div>

      <div className='seam-detail-group'>{children}</div>
    </div>
  )
}
