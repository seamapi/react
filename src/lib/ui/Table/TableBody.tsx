import type { ReactNode } from 'react'

export function TableBody(props: { children: ReactNode }) {
  return <div className='seam-table-body'>{props.children}</div>
}
