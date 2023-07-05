interface HiddenDevicesOverlayProps {
  visible: boolean
}

export function HiddenDevicesOverlay({
  visible,
}: HiddenDevicesOverlayProps): JSX.Element | null {
  if (!visible) {
    return null
  }

  return <div className='hidden-devices-overlay' />
}
