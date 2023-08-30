import type { PropsWithChildren } from 'react'

import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'

interface DetailSectionProps {
  label: string
  tooltipContent?: string
}

export function DetailSection({
  label,
  tooltipContent,
  children,
}: PropsWithChildren<DetailSectionProps>): JSX.Element {
  return (
    <div className='seam-thermostat-detail-section'>
      <div className='seam-thermostat-detail-label-wrap'>
        <p className='seam-thermostat-detail-label'>{label}</p>
        {tooltipContent != null && <Tooltip>{tooltipContent}</Tooltip>}
      </div>

      <div className='seam-thermostat-detail-group'>{children}</div>
    </div>
  )
}
