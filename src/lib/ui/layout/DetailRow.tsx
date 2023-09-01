import type { PropsWithChildren } from 'react'

interface DetailRowProps {
  label: string
  sublabel?: string
}

export function DetailRow({
  label,
  sublabel,
  children,
}: PropsWithChildren<DetailRowProps>): JSX.Element {
  return (
    <div className='seam-detail-row'>
      <div className='seam-detail-row-label-wrap'>
        <p className='seam-row-label'>{label}</p>
        {sublabel != undefined && (
          <p className='seam-row-sublabel'>{sublabel}</p>
        )}
      </div>
      <div className='seam-detail-row-right-area-content'>{children}</div>
    </div>
  )
}
