import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'

interface ShowAllDevicesButtonProps {
  onClick: () => void
  isShowing: boolean
  viewingAllDevices: boolean
  totalDeviceCount: number
}

export function ShowAllDevicesButton({
  onClick,
  isShowing,
  viewingAllDevices,
  totalDeviceCount,
}: ShowAllDevicesButtonProps) {
  if (!isShowing) {
    return null
  }

  const label = viewingAllDevices ? t.showLess : t.seeAll(totalDeviceCount)

  return (
    <button className='show-all-devices-button' onClick={onClick}>
      <ChevronRightIcon /> {label}
    </button>
  )
}

const t = {
  showLess: 'Show less',
  seeAll: (count: number) => `See all ${count} devices`,
}
