import type { PropsWithChildren } from 'react'

import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'

interface DetailSectionProps {
  title: string
  tooltipContent?: string
}

export function DetailSection({
  title,
  tooltipContent,
  children,
}: PropsWithChildren<DetailSectionProps>) {
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
