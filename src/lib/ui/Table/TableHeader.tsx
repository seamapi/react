import type { PropsWithChildren } from 'react'

export function TableHeader({ children }: PropsWithChildren): JSX.Element {
  return <div className='seam-table-header'>{children}</div>
}
