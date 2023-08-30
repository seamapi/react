import type { PropsWithChildren } from 'react'

interface DetailRowProps {
  label: string
}

export function DetailRow({
  label,
  children,
}: PropsWithChildren<DetailRowProps>): JSX.Element {
  return (
    <div className='seam-thermostat-detail-row'>
      <p className='seam-thermostat-row-label'>{label}</p>
      <div className='seam-thermostat-detail-row-right-area-content'>
        {children}
      </div>
    </div>
  )
}
