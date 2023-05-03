import type { ReactNode } from 'react'

export function Title(props: { children: ReactNode }) {
  return <span className='seam-title'>{props.children}</span>
}
