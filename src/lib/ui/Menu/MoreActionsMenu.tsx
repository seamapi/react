import { DotsEllipsisMoreIcon } from 'lib/icons/DotsEllipsisMore.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { Menu, type MenuProps } from 'lib/ui/Menu/Menu.js'

interface MoreActionsMenuProps {
  children: JSX.Element | JSX.Element[]
  MenuProps?: Partial<MenuProps>
}
export function MoreActionsMenu({ children, MenuProps }: MoreActionsMenuProps) {
  return (
    <Menu
      button={({ open }) => (
        <IconButton
          onClick={(event) => {
            event.stopPropagation()
            open(event)
          }}
        >
          <DotsEllipsisMoreIcon />
        </IconButton>
      )}
      {...MenuProps}
    >
      {children}
    </Menu>
  )
}
