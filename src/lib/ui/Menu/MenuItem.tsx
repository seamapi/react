import type { ReactNode } from 'react'

import { useMenu } from 'lib/ui/Menu/Menu.js'

export interface MenuItemProps {
  children: ReactNode
  onClick: () => void
}

export function MenuItem({ children, onClick }: MenuItemProps) {
  const { close: closeMenu } = useMenu()

  return (
    <div
      className='seam-menu-item'
      onClick={() => {
        onClick()
        closeMenu()
      }}
    >
      {children}
    </div>
  )
}
