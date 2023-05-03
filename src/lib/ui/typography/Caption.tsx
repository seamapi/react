import type { ReactNode } from 'react'

export function Caption(props: { children: ReactNode }) {
  return <span className='seam-caption'>{props.children}</span>
}
