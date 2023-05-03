import { type AccessCode, type LockDevice } from 'seamapi'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { AccessCodeTable } from 'lib/ui/AccessCodeTable/AccessCodeTable.js'
import { BatteryStatus } from 'lib/ui/DeviceDetails/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/DeviceDetails/DeviceImage.js'
import { ModelStatus } from 'lib/ui/DeviceDetails/ModelStatus.js'
import { OnlineStatus } from 'lib/ui/DeviceDetails/OnlineStatus.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import useToggle from 'lib/use-toggle.js'

export function DeviceDetails(props: { device: LockDevice }) {
  const { device } = props

  const lockStatus = device.properties.locked ? t.locked : t.unlocked

  const accessCodeLength =
    device.properties?.schlage_metadata?.access_code_length ?? null

  // TODO : Fetch access codes
  const accessCodes: AccessCode[] = []

  const [showingAccessCodes, toggleAccessCodes] = useToggle()

  if (showingAccessCodes) {
    return (
      <AccessCodeTable
        accessCodes={accessCodes}
        onClickBack={toggleAccessCodes}
      />
    )
  }

  return (
    <div className='seam--device-details'>
      <ContentHeader title='Device' />
      <div className='seam--body'>
        <div className='seam--summary'>
          <div className='seam--content'>
            <div className='seam--image'>
              <DeviceImage device={device} />
            </div>

            <div className='seam--info'>
              <h4 className='seam--device-name'>{device.properties.name}</h4>
              <div className='seam--properties'>
                <OnlineStatus device={device} />
                <BatteryStatus device={device} />
                <ModelStatus device={device} />
              </div>
            </div>
          </div>
        </div>
        <div className='seam--box'>
          <div
            className='seam--content seam--access-codes'
            onClick={toggleAccessCodes}
          >
            <span className='seam--value'>49 {t.accessCodes}</span>
            <ChevronRightIcon />
          </div>
        </div>

        <div className='seam--box'>
          <div className='seam--content'>
            <span className='seam--label'>{t.lockStatus}</span>
            <span className='seam--value'>{lockStatus}</span>
          </div>
          <AccessCodeLength accessCodeLength={accessCodeLength} />
        </div>
      </div>
    </div>
  )
}

function AccessCodeLength(props: { accessCodeLength: number | null }) {
  const { accessCodeLength } = props
  if (accessCodeLength === null) {
    return null
  }

  return (
    <div className='seam--content seam--access-code-length'>
      <span className='seam--label'>{t.codeLength}</span>
      <span className='seam--value'>
        {accessCodeLength} {t.digits}
      </span>
    </div>
  )
}

const t = {
  locked: 'Locked',
  unlocked: 'Unlocked',
  accessCodes: 'access codes',
  codeLength: 'Code length',
  digits: 'digits',
  lockStatus: 'lockStatus',
}
