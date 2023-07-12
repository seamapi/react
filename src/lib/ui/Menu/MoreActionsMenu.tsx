import type { PropsWithChildren } from 'react'

import { DotsEllipsisMoreIcon } from 'lib/icons/DotsEllipsisMore.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { Menu, type MenuProps } from 'lib/ui/Menu/Menu.js'

interface MoreActionsMenuProps extends PropsWithChildren {
  menuProps?: Partial<MenuProps>
}

export function MoreActionsMenu({
  children,
  menuProps,
}: MoreActionsMenuProps): JSX.Element {
  return (
    <Menu
      renderButton={({ onOpen }) => (
        <IconButton
          onClick={(event) => {
            event.stopPropagation()
            onOpen(event)
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
