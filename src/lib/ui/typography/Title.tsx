import type { PropsWithChildren } from 'react'

export function Title({ children }: PropsWithChildren): JSX.Element {
  return <span className='seam-title'>{children}</span>
}
