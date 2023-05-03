import type { PropsWithChildren } from 'react'

export function Caption({ children }: PropsWithChildren) {
  return <span className='seam-caption'>{children}</span>
}
