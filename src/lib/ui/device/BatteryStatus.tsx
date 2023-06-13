import type {
  BatteryStatus as SeamBatteryStatus,
  CommonDeviceProperties,
  Device,
} from 'seamapi'

import { BatteryLevelCriticalIcon } from 'lib/icons/BatteryLevelCritical.js'
import { BatteryLevelFullIcon } from 'lib/icons/BatteryLevelFull.js'
import { BatteryLevelHighIcon } from 'lib/icons/BatteryLevelHigh.js'
import { BatteryLevelLowIcon } from 'lib/icons/BatteryLevelLow.js'

interface BatteryStatusProps {
  device: Device<CommonDeviceProperties>
}

export function BatteryStatus(props: BatteryStatusProps): JSX.Element {
  return (
    <div className='seam-battery-status'>
      <Content status={props.device.properties.battery?.status} />
    </div>
  )
}

function Content(props: {
  status: SeamBatteryStatus | null | undefined
}): JSX.Element | null {
  const { status } = props

  if (status === 'full') {
    return (
      <>
        <BatteryLevelFullIcon />
        <span className='seam-status-text'>{t.full}</span>
      </>
    )
  }

  if (status === 'good') {
    return (
      <>
        <BatteryLevelHighIcon />
        <span className='seam-status-text'>{t.high}</span>
      </>
    )
  }

  if (status === 'low') {
    return (
      <>
        <BatteryLevelLowIcon />
        <span className='seam-status-text'>{t.low}</span>
      </>
    )
  }

  if (status === 'critical') {
    return (
      <>
        <BatteryLevelCriticalIcon />
        <span className='seam-text-danger'>{t.critical}</span>
      </>
    )
  }

  return null
}

const t = {
  full: 'Good',
  high: 'Good',
  low: 'Low',
  critical: 'Low!',
}
