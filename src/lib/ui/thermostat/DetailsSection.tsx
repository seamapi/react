import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'

import type { PropsWithChildren } from 'react'

interface DetailsSectionProps {
  title: string
  tooltipContent?: string
}

export function DetailsSection({
  title,
  tooltipContent,
  children,
}: PropsWithChildren<DetailsSectionProps>) {
  return (
    <div className='seam-thermostat-detail-section'>
      <div className='seam-thermostat-detail-label-wrap'>
        <p className='seam-thermostat-detail-label'>{title}</p>
        {tooltipContent && <Tooltip>{tooltipContent}</Tooltip>}
      </div>

      <div className='seam-thermostat-detail-group'>{children}</div>
    </div>
  )
}
