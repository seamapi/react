import type { PropsWithChildren } from 'react'

export function Title({ children }: PropsWithChildren) {
  return <span className='seam-title'>{children}</span>
}
