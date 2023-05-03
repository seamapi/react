import type { PropsWithChildren } from 'react'

export function TableHeader({ children }: PropsWithChildren) {
  return <div className='seam-table-header'>{children}</div>
}
