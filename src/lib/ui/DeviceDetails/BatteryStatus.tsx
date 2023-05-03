import type { LockDevice } from 'seamapi'

import { BatteryLevelCriticalIcon } from 'lib/icons/BatteryLevelCritical.js'
import { BatteryLevelFullIcon } from 'lib/icons/BatteryLevelFull.js'
import { BatteryLevelHighIcon } from 'lib/icons/BatteryLevelHigh.js'
import { BatteryLevelLowIcon } from 'lib/icons/BatteryLevelLow.js'

/**
 * Thresholds to determine the battery status
 */
const BATTERY_LEVEL = {
  FULL: 0.85,
  HIGH: 0.6,
  LOW: 0.3,
}
export function BatteryStatus(props: { device: LockDevice }) {
  const {
    device: {
      properties: { battery_level: batteryLevel },
    },
  } = props

  if (batteryLevel === undefined) {
    return null
  }

  return (
    <>
      <span className='seam--label'>Power:</span>{' '}
      <div className='seam--battery-status'>
        <Status batteryLevel={batteryLevel} />
      </div>
    </>
  )
}

function Status(props: { batteryLevel: number }) {
  const { batteryLevel } = props

  if (batteryLevel > BATTERY_LEVEL.FULL) {
    return (
      <>
        <BatteryLevelFullIcon />
        <span className='seam--status-text'>Good</span>
      </>
    )
  }

  if (batteryLevel > BATTERY_LEVEL.HIGH) {
    return (
      <>
        <BatteryLevelHighIcon />
        <span className='seam--status-text'>Good</span>
      </>
    )
  }

  if (batteryLevel > BATTERY_LEVEL.LOW) {
    return (
      <>
        <BatteryLevelLowIcon />
        <span className='seam--status-text'>Low</span>
      </>
    )
  }

  return (
    <>
      <BatteryLevelCriticalIcon />
      <span className='seam--text-danger'>Low!</span>
    </>
  )
}

function isFull(batteryLevel: number) {
  return batteryLevel > 0.9
}
