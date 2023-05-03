import type { ReactNode } from 'react'

export function TableHeader(props: { children: ReactNode }) {
  return <div className='seam-table-header'>{props.children}</div>
}
