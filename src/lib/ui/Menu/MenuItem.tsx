import classNames from 'classnames'
import type { PropsWithChildren } from 'react'

import { useMenu } from 'lib/ui/Menu/Menu.js'

interface MenuItemProps extends PropsWithChildren {
  onClick: (event: React.MouseEvent) => void
  className?: string
  disableCloseOnClick?: boolean
}

export function MenuItem({
  onClick,
  children,
  className,
  disableCloseOnClick = false,
}: MenuItemProps): JSX.Element {
  const { close: closeMenu } = useMenu()

  return (
    <div
      className={classNames('seam-menu-item', className)}
      onClick={(event: React.MouseEvent) => {
        onClick(event)

        if (!disableCloseOnClick) {
          closeMenu()
        }
      }}
    >
      {children}
    </div>
  )
}
