interface HiddenDevicesOverlayProps {
  visible: boolean
}

export function HiddenDevicesOverlay({ visible }: HiddenDevicesOverlayProps) {
  if (!visible) {
    return null
  }

  return <div className='hidden-devices-overlay' />
}
