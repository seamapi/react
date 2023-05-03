import type { PropsWithChildren } from 'react'

export function Caption({ children }: PropsWithChildren): JSX.Element {
  return <span className='seam-caption'>{children}</span>
}
