import classNames from 'classnames'
import type { PropsWithChildren } from 'react'

interface DetailRowProps {
  label: string
  sublabel?: string
  onClick?: () => void
}

export function DetailRow({
  label,
  sublabel,
  onClick,
  children,
}: PropsWithChildren<DetailRowProps>): JSX.Element {
  return (
    <div
      className={classNames(
        'seam-detail-row',
        onClick != null && 'seam-detail-row-clickable'
      )}
      onClick={onClick}
    >
      <div className='seam-detail-row-label-wrap'>
        <p className='seam-row-label'>{label}</p>
        {sublabel != null && <p className='seam-row-sublabel'>{sublabel}</p>}
      </div>
      <div className='seam-detail-row-right-area-content'>{children}</div>
    </div>
  )
}
