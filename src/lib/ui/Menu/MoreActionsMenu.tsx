import { DotsEllipsisMoreIcon } from 'lib/icons/DotsEllipsisMore.js'
import { IconButton } from 'lib/ui/IconButton.js'
import Menu from 'lib/ui/Menu/Menu.js'

export interface MoreActionsMenuProps {
  children: JSX.Element | JSX.Element[]
}
export function MoreActionsMenu({ children }: MoreActionsMenuProps) {
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
    >
      {children}
    </Menu>
  )
}
