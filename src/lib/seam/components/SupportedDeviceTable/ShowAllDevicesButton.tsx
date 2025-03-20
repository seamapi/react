import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'

interface ShowAllDevicesButtonProps {
  onClick: () => void
  visible: boolean
  expanded: boolean
  totalDeviceCount: number
}

export function ShowAllDevicesButton({
  onClick,
  visible,
  expanded,
  totalDeviceCount,
}: ShowAllDevicesButtonProps): JSX.Element | null {
  if (!visible) {
    return null
  }

  const label = expanded ? t.showLess : t.showAll(totalDeviceCount)

  return (
    <button type='button' className='show-all-devices-button' onClick={onClick}>
      <ChevronRightIcon /> {label}
    </button>
  )
}

const t = {
  showLess: 'Show less',
  showAll: (count: number) => `See all ${count}`,
}
