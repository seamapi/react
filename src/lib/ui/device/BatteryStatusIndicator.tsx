import type { Device } from '@seamapi/types/connect'

import { BatteryLevelCriticalIcon } from 'lib/icons/BatteryLevelCritical.js'
import { BatteryLevelFullIcon } from 'lib/icons/BatteryLevelFull.js'
import { BatteryLevelHighIcon } from 'lib/icons/BatteryLevelHigh.js'
import { BatteryLevelLowIcon } from 'lib/icons/BatteryLevelLow.js'

interface BatteryStatusIndicatorProps {
  device: Device
}

// UPSTREAM: Missing BatteryStatusIndicator type in @seamapi/types/connect.
type BatteryStatus = 'low' | 'full' | 'critical' | 'good'

export function BatteryStatusIndicator(
  props: BatteryStatusIndicatorProps
): JSX.Element {
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
  status: BatteryStatus | null | undefined
  level: number | null | undefined
}): JSX.Element | null {
  const { status, level } = props

  if (status === 'full') {
    return (
      <>
        <BatteryLevelFullIcon />
        <span className='seam-status-text'>
          {t.full}
          <Percentage level={level} />
        </span>
      </>
    )
  }

  if (status === 'good') {
    return (
      <>
        <BatteryLevelHighIcon />
        <span className='seam-status-text'>
          {t.high}
          <Percentage level={level} />
        </span>
      </>
    )
  }

  if (status === 'low') {
    return (
      <>
        <BatteryLevelLowIcon />
        <span className='seam-status-text'>
          {t.low}
          <Percentage level={level} />
        </span>
      </>
    )
  }

  if (status === 'critical') {
    return (
      <>
        <BatteryLevelCriticalIcon />
        <span className='seam-text-danger'>
          {t.critical}
          <Percentage level={level} />
        </span>
      </>
    )
  }

  return null
}

function Percentage(props: {
  level: number | null | undefined
}): JSX.Element | null {
  if (props.level == null) return null
  return <> ({Math.floor(props.level * 100)}%)</>
}

const t = {
  full: 'Good',
  high: 'Good',
  low: 'Low',
  critical: 'Low!',
}
