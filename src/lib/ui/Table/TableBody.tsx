import type { PropsWithChildren } from 'react'

export function TableBody({ children }: PropsWithChildren): JSX.Element {
  return <div className='seam-table-body'>{children}</div>
}
