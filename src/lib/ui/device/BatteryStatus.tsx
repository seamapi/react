import type { CommonDevice, BatteryStatus as SeamBatteryStatus } from 'seamapi'

import { BatteryLevelCriticalIcon } from 'lib/icons/BatteryLevelCritical.js'
import { BatteryLevelFullIcon } from 'lib/icons/BatteryLevelFull.js'
import { BatteryLevelHighIcon } from 'lib/icons/BatteryLevelHigh.js'
import { BatteryLevelLowIcon } from 'lib/icons/BatteryLevelLow.js'

interface BatteryStatusProps {
  device: CommonDevice
}

export function BatteryStatus(props: BatteryStatusProps): JSX.Element {
  return (
    <div className='seam-battery-status'>
      <Content
        status={props.device.properties.battery?.status}
        level={props.device.properties.battery?.level}
      />
    </div>
  )
}

function Content(props: {
  status: SeamBatteryStatus | null | undefined
  level: number | null | undefined
}): JSX.Element | null {
  const { status, level } = props

  const percentage = level ? ` (${Math.floor(level * 100)}%)` : null

  if (status === 'full') {
    return (
      <>
        <BatteryLevelFullIcon />
        <span className='seam-status-text'>{`${t.full}${
          percentage ?? ''
        }`}</span>
      </>
    )
  }

  if (status === 'good') {
    return (
      <>
        <BatteryLevelHighIcon />
        <span className='seam-status-text'>{`${t.high}${
          percentage ?? ''
        }`}</span>
      </>
    )
  }

  if (status === 'low') {
    return (
      <>
        <BatteryLevelLowIcon />
        <span className='seam-status-text'>{`${t.low}${
          percentage ?? ''
        }`}</span>
      </>
    )
  }

  if (status === 'critical') {
    return (
      <>
        <BatteryLevelCriticalIcon />
        <span className='seam-text-danger'>{`${t.critical}${
          percentage ?? ''
        }`}</span>
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
