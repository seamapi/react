import type { ReactNode } from 'react'

export interface MenuItemProps {
  children: ReactNode
}

export function MenuItem({ children }: MenuItemProps) {
  return <div className='seam-menu-item'>{children}</div>
}
