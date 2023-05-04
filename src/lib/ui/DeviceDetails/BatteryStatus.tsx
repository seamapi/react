import type { LockDevice } from 'seamapi'

import { BatteryLevelCriticalIcon } from 'lib/icons/BatteryLevelCritical.js'
import { BatteryLevelFullIcon } from 'lib/icons/BatteryLevelFull.js'
import { BatteryLevelHighIcon } from 'lib/icons/BatteryLevelHigh.js'
import { BatteryLevelLowIcon } from 'lib/icons/BatteryLevelLow.js'

export function BatteryStatus(props: {
  device: LockDevice
}): JSX.Element | null {
  const {
    device: {
      properties: { battery_level: batteryLevel },
    },
  } = props

  if (batteryLevel == null) {
    return null
  }

  return (
    <>
      <span className='seam-label'>{t.power}:</span>{' '}
      <div className='seam-battery-status'>
        <Status batteryLevel={batteryLevel} />
      </div>
    </>
  )
}

function Status(props: { batteryLevel: number }): JSX.Element {
  const { batteryLevel } = props

  if (batteryLevel > batteryThreshold.full) {
    return (
      <>
        <BatteryLevelFullIcon />
        <span className='seam-status-text'>{t.full}</span>
      </>
    )
  }

  if (batteryLevel > batteryThreshold.high) {
    return (
      <>
        <BatteryLevelHighIcon />
        <span className='seam-status-text'>{t.high}</span>
      </>
    )
  }

  if (batteryLevel > batteryThreshold.low) {
    return (
      <>
        <BatteryLevelLowIcon />
        <span className='seam-status-text'>{t.low}</span>
      </>
    )
  }

  return (
    <>
      <BatteryLevelCriticalIcon />
      <span className='seam-text-danger'>{t.critical}</span>
    </>
  )
}

const batteryThreshold = {
  full: 0.85,
  high: 0.6,
  low: 0.3,
}

const t = {
  power: 'Power',
  full: 'Good',
  high: 'Good',
  low: 'Low',
  critical: 'Low!',
}
