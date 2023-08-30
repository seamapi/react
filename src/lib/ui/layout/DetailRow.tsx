import type { PropsWithChildren } from 'react'

interface DetailRowProps {
  label: string
}

export function DetailRow({
  label,
  children,
}: PropsWithChildren<DetailRowProps>): JSX.Element {
  return (
    <div className='seam-detail-row'>
      <p className='seam-row-label'>{label}</p>
      <div className='seam-detail-row-right-area-content'>{children}</div>
    </div>
  )
}
