import { DotsEllipsisMoreIcon } from 'lib/icons/DotsEllipsisMore.js'
import { IconButton } from 'lib/ui/IconButton.js'
import Menu, { type MenuProps } from 'lib/ui/Menu/Menu.js'

export interface MoreActionsMenuProps {
  children: JSX.Element | JSX.Element[]
  MenuProps?: Partial<MenuProps>
}
export function MoreActionsMenu({ children, MenuProps }: MoreActionsMenuProps) {
  return (
    <Menu
      button={({ open }) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            open(e)
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
