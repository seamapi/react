import type { ReactNode } from 'react'

export function TableTitle(props: { children: ReactNode }) {
  return <h5 className='seam-table-title'>{props.children}</h5>
}
