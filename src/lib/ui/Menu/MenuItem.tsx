import { useMenu } from 'lib/ui/Menu/Menu.js'

interface MenuItemProps {
  children: JSX.Element
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
