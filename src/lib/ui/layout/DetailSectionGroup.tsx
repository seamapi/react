import type { PropsWithChildren } from 'react'

export function DetailSectionGroup({
  children,
}: PropsWithChildren): JSX.Element {
  return <div className='seam-thermostat-detail-sections'>{children}</div>
}
