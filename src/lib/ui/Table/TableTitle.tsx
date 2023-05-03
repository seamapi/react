import type { PropsWithChildren } from 'react'

export function TableTitle({ children }: PropsWithChildren) {
  return <h5 className='seam-table-title'>{children}</h5>
}
