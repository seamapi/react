interface HiddenDevicesOverlayProps {
  isShowing: boolean
}

export function HiddenDevicesOverlay({ isShowing }: HiddenDevicesOverlayProps) {
  if (!isShowing) {
    return null
  }

  return <div className='hidden-devices-overlay' />
}
