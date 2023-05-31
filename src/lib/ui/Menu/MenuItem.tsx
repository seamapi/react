import type { PropsWithChildren } from 'react'

import { useMenu } from 'lib/ui/Menu/Menu.js'

interface MenuItemProps {
  onClick: () => void
}

export function MenuItem({
  onClick,
  children,
}: PropsWithChildren<MenuItemProps>): JSX.Element {
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
