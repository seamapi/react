import type { PropsWithChildren } from 'react'

interface DetailRowProps {
  title: string
}

export function DetailRow({
  title,
  children,
}: PropsWithChildren<DetailRowProps>) {
  return (
    <div className='seam-thermostat-detail-row'>
      <p className='seam-thermostat-row-title'>{title}</p>
    </div>
  )
}
