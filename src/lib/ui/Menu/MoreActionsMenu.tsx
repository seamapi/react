import type { PropsWithChildren } from 'react'

import { DotsEllipsisMoreIcon } from 'lib/icons/DotsEllipsisMore.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { Menu, type MenuProps } from 'lib/ui/Menu/Menu.js'

interface MoreActionsMenuProps {
  menuProps?: Partial<MenuProps>
}

export function MoreActionsMenu({
  children,
  menuProps,
}: PropsWithChildren<MoreActionsMenuProps>) {
  return (
    <Menu
      renderButton={({ open }) => (
        <IconButton
          onClick={(event) => {
            event.stopPropagation()
            open(event)
          }}
        >
          <DotsEllipsisMoreIcon />
        </IconButton>
      )}
      {...menuProps}
    >
      {children}
    </Menu>
  )
}
