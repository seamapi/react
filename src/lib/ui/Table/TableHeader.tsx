import type { PropsWithChildren } from 'react'

export function TableHeader({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className='seam-table-header'>
      <div className='seam-body'>{children}</div>
    </div>
  )
}
